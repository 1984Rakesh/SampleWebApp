import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createDatabase } from '../src/foundation/database/connection';
import { runMigrations } from '../src/foundation/database/migrations';
import { ConflictError, NotFoundError, UnauthorizedError, ValidationError } from '../src/shared/domain/errors';
import type { SessionAccount } from '../src/security/domain/models/Account';
import type { TokenPayload } from '../src/security/domain/models/Auth';
import type { TokenService } from '../src/security/domain/ports/TokenService';
import { RefreshAccessTokenUseCase } from '../src/security/domain/useCases/RefreshAccessTokenUseCase';
import { SqliteAccountRepository } from '../src/security/infrastructure/repositories/SqliteAccountRepository';
import { rowToAccount, rowToCredentials } from '../src/security/infrastructure/persistence/AccountRow';
import { authResultToResponse } from '../src/security/presentation/mappers/AuthDtoMapper';
import type { Profile, ProfileChanges } from '../src/profile/domain/models/Profile';
import type { ProfileRepository } from '../src/profile/domain/ports/ProfileRepository';
import { GetCurrentUserUseCase } from '../src/profile/domain/useCases/GetCurrentUserUseCase';
import { UpdateProfileUseCase } from '../src/profile/domain/useCases/UpdateProfileUseCase';
import { SqliteProfileRepository } from '../src/profile/infrastructure/repositories/SqliteProfileRepository';
import { profileToResponse } from '../src/profile/presentation/mappers/ProfileDtoMapper';

const profile: Profile = {
  id: 'user-id', name: 'Name', email: 'test@example.test', avatar: null, bio: null,
  createdAt: '2026-10-20T03:00:00Z',
};

function tokens(overrides: Partial<TokenService> = {}): TokenService {
  const unexpected = async (): Promise<never> => assert.fail('Unexpected token operation');
  return {
    issueTokens: unexpected,
    issueAccessToken: unexpected,
    verifyAccessToken: unexpected,
    verifyRefreshToken: unexpected,
    ...overrides,
  };
}

test('account and profile repositories share storage without sharing credential capabilities', async (t) => {
  const db = createDatabase(':memory:');
  t.after(() => db.close());
  runMigrations(db);
  const accounts = new SqliteAccountRepository(db);
  const profiles = new SqliteProfileRepository(db);
  const created = await accounts.create({ name: 'Name', email: profile.email, passwordHash: 'test-only-hash' });
  assert.deepEqual(await accounts.findIdentityById(created.id), { id: created.id, email: created.email });
  assert.deepEqual(await profiles.findById(created.id), created);
  assert.equal('passwordHash' in created, false);
  assert.equal('findCredentialsByEmail' in profiles, false);
  assert.equal('create' in profiles, false);
  assert.equal('updateProfile' in accounts, false);
  const changed = await new UpdateProfileUseCase(profiles).execute({
    userId: created.id, changes: { name: '  Updated  ', bio: '  Bio  ', avatar: 'avatar.png' },
  });
  const credentials = await accounts.findCredentialsByEmail(created.email);
  assert.ok(credentials);
  assert.equal(credentials.passwordHash, 'test-only-hash');
  assert.deepEqual(credentials.account, changed);
  assert.equal(changed.name, 'Updated');
  assert.equal(changed.bio, 'Bio');
  assert.equal('passwordHash' in changed, false);
  assert.deepEqual(await accounts.findIdentityById(created.id), { id: created.id, email: created.email });
  await assert.rejects(accounts.create({ name: 'Duplicate', email: created.email, passwordHash: 'other-test-hash' }), ConflictError);
  assert.equal(await accounts.findIdentityById('missing'), null);
  assert.equal(await accounts.findCredentialsByEmail('missing@example.test'), null);
  assert.equal(await profiles.findById('missing'), null);
  assert.equal(await profiles.updateProfile('missing', { bio: null }), null);
});

test('refresh uses only identity lookup and signs current stored identity rather than stale token email', async () => {
  let verified = false;
  let issued: TokenPayload | undefined;
  const refresh = new RefreshAccessTokenUseCase(tokens({
    verifyRefreshToken: async (token) => {
      assert.equal(token, 'refresh-token');
      verified = true;
      return { userId: profile.id, email: 'stale@example.test' };
    },
    issueAccessToken: async (identity) => {
      issued = identity;
      return 'new-access-token';
    },
  }), {
    findIdentityById: async (id) => {
      assert.equal(verified, true);
      assert.equal(id, profile.id);
      return { id, email: profile.email };
    },
  });
  assert.equal(await refresh.execute('refresh-token'), 'new-access-token');
  assert.deepEqual(issued, { userId: profile.id, email: profile.email });
});

test('refresh rejects missing accounts and propagates verification failures before identity lookup', async () => {
  const missing = new RefreshAccessTokenUseCase(tokens({
    verifyRefreshToken: async () => ({ userId: profile.id, email: profile.email }),
  }), { findIdentityById: async () => null });
  await assert.rejects(missing.execute('refresh-token'), UnauthorizedError);
  const failure = new UnauthorizedError('Expired refresh token');
  const invalid = new RefreshAccessTokenUseCase(tokens({
    verifyRefreshToken: async () => { throw failure; },
  }), { findIdentityById: async () => assert.fail('Invalid token reached identity lookup') });
  await assert.rejects(invalid.execute('invalid'), (error) => error === failure);
});

test('profile use cases need only profile ports and preserve normalized tri-state changes', async () => {
  const changesSeen: ProfileChanges[] = [];
  const repository: ProfileRepository = {
    findById: async (id) => { assert.equal(id, profile.id); return profile; },
    updateProfile: async (id, changes) => {
      assert.equal(id, profile.id);
      changesSeen.push(changes);
      return profile;
    },
  };
  assert.deepEqual(await new GetCurrentUserUseCase(repository).execute(profile.id), profile);
  const update = new UpdateProfileUseCase(repository);
  await update.execute({ userId: profile.id, changes: {} });
  await update.execute({ userId: profile.id, changes: { name: '  Updated  ', bio: null, avatar: ' ' } });
  await update.execute({ userId: profile.id, changes: { bio: '  Bio  ', avatar: '  avatar.png  ' } });
  assert.deepEqual(changesSeen, [
    { name: undefined, bio: undefined, avatar: undefined },
    { name: 'Updated', bio: null, avatar: null },
    { name: undefined, bio: 'Bio', avatar: 'avatar.png' },
  ]);
  await assert.rejects(update.execute({ userId: profile.id, changes: { name: ' ' } }), ValidationError);
  assert.equal(changesSeen.length, 3);
  const missing: ProfileRepository = { findById: async () => null, updateProfile: async () => null };
  await assert.rejects(new GetCurrentUserUseCase(missing).execute('missing'), NotFoundError);
  await assert.rejects(new UpdateProfileUseCase(missing).execute({ userId: 'missing', changes: {} }), NotFoundError);
});

test('security persistence maps account snapshots and credentials independently to UTC domain values', () => {
  const row = {
    id: profile.id, name: profile.name, email: profile.email, avatar: null, bio: null,
    created_at: '2026-10-20 03:00:00', password_hash: 'test-only-hash',
  };
  const expected: SessionAccount = { ...profile };
  assert.deepEqual(rowToAccount(row), expected);
  assert.deepEqual(rowToCredentials(row), { account: expected, passwordHash: 'test-only-hash' });
  assert.equal('password_hash' in rowToAccount(row), false);
});

test('feature response mappers explicitly whitelist fields and preserve the public user envelope', () => {
  const extra = { ...profile, passwordHash: 'test-only-hash', password_hash: 'test-only-hash' };
  const auth = authResultToResponse({ account: extra, tokens: { accessToken: 'access', refreshToken: 'refresh' } });
  assert.deepEqual(auth, { user: profile, accessToken: 'access', refreshToken: 'refresh' });
  assert.deepEqual(profileToResponse(extra), profile);
});
