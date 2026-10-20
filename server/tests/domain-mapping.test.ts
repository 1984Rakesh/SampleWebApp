import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadConfig } from '../src/app/config';
import { UnauthorizedError, ValidationError } from '../src/shared/domain/errors';
import { normalizeOptionalText } from '../src/shared/domain/normalizeOptionalText';
import { normalizeTaskTitle } from '../src/tasks/domain/models/Task';
import { normalizeEmail, validatePassword } from '../src/security/domain/models/Account';
import { normalizeUserName } from '../src/shared/domain/normalizeUserName';
import { RegisterUserUseCase } from '../src/security/domain/useCases/RegisterUserUseCase';
import { rowToTask, type TaskRow } from '../src/tasks/infrastructure/persistence/TaskRow';
import { normalizeSqliteTimestamp } from '../src/foundation/persistence/normalizeSqliteTimestamp';
import { rowToProfile } from '../src/profile/infrastructure/persistence/ProfileRow';
import { JwtTokenService } from '../src/security/infrastructure/security/JwtTokenService';

const taskRow: TaskRow = {
  id: 'task-id',
  title: 'Task',
  description: null,
  status: 'IN_PROGRESS',
  priority: 'HIGH',
  due_date: null,
  user_id: 'user-id',
  created_at: '2026-10-20 03:00:00',
  updated_at: '2026-10-20 04:00:00',
};

test('domain normalization validates required text, email and password invariants', () => {
  assert.equal(normalizeTaskTitle('  Task  '), 'Task');
  assert.equal(normalizeUserName('  Name  '), 'Name');
  assert.equal(normalizeEmail('  TEST@EXAMPLE.TEST  '), 'test@example.test');
  assert.equal(validatePassword('123456'), '123456');
  assert.equal(validatePassword(' 123456 '), ' 123456 ');
  for (const validate of [
    () => normalizeTaskTitle(' '),
    () => normalizeUserName(' '),
    () => normalizeEmail(' '),
    () => normalizeEmail('not-an-email'),
    () => validatePassword('12345'),
    () => validatePassword(''),
  ]) {
    assert.throws(validate, ValidationError);
  }
});

test('optional normalization preserves patch omission and explicit clearing', () => {
  assert.equal(normalizeOptionalText(undefined), undefined);
  assert.equal(normalizeOptionalText(null), null);
  assert.equal(normalizeOptionalText(''), null);
  assert.equal(normalizeOptionalText('   '), null);
  assert.equal(normalizeOptionalText('  Value  '), 'Value');
});

test('registration validates before calling any infrastructure port', async () => {
  const unexpectedCall = async (): Promise<never> => assert.fail('Invalid input reached a port');
  const register = new RegisterUserUseCase(
    {
      findIdentityById: unexpectedCall,
      findCredentialsByEmail: unexpectedCall,
      create: unexpectedCall,
    },
    { hash: unexpectedCall, verify: unexpectedCall },
    {
      issueTokens: unexpectedCall,
      issueAccessToken: unexpectedCall,
      verifyAccessToken: unexpectedCall,
      verifyRefreshToken: unexpectedCall,
    }
  );
  for (const input of [
    { name: ' ', email: 'test@example.test', password: '123456' },
    { name: 'Name', email: 'invalid', password: '123456' },
    { name: 'Name', email: 'test@example.test', password: '12345' },
  ]) {
    await assert.rejects(register.execute(input), ValidationError);
  }
});

test('row mappers translate column names and normalize SQLite timestamps to UTC', () => {
  const task = rowToTask(taskRow);
  assert.deepEqual(task, {
    id: 'task-id', title: 'Task', description: null, status: 'IN_PROGRESS', priority: 'HIGH',
    dueDate: null, userId: 'user-id', createdAt: '2026-10-20T03:00:00Z', updatedAt: '2026-10-20T04:00:00Z',
  });
  assert.equal(normalizeSqliteTimestamp('2026-10-20T03:00:00.000Z'), '2026-10-20T03:00:00.000Z');
  assert.equal(normalizeSqliteTimestamp('2026-10-20T03:00:00Z'), '2026-10-20T03:00:00Z');
  assert.deepEqual(rowToProfile({
    id: 'user-id', name: 'Name', email: 'test@example.test', avatar: null, bio: null,
    created_at: taskRow.created_at,
  }), {
    id: 'user-id', name: 'Name', email: 'test@example.test', avatar: null, bio: null,
    createdAt: '2026-10-20T03:00:00Z',
  });
});

test('task row mapping rejects invalid persisted enums instead of fabricating defaults', () => {
  for (const status of ['INVALID', '', 'todo']) {
    assert.throws(() => rowToTask({ ...taskRow, status }), /Invalid persisted task status/);
  }
  for (const priority of ['INVALID', '', 'high']) {
    assert.throws(() => rowToTask({ ...taskRow, priority }), /Invalid persisted task priority/);
  }
});

test('token adapter preserves type separation and translates JWT failures', async () => {
  const config = { secret: 'disposable-test-signing-key', accessExpiresIn: '1h', refreshExpiresIn: '7d' };
  const service = new JwtTokenService(config);
  const identity = { userId: 'user-id', email: 'test@example.test' };
  const tokens = await service.issueTokens(identity);
  assert.deepEqual(await service.verifyAccessToken(tokens.accessToken), identity);
  assert.deepEqual(await service.verifyRefreshToken(tokens.refreshToken), identity);
  await assert.rejects(service.verifyAccessToken(tokens.refreshToken), UnauthorizedError);
  await assert.rejects(service.verifyRefreshToken(tokens.accessToken), UnauthorizedError);
  await assert.rejects(service.verifyAccessToken('invalid-token'), UnauthorizedError);
  const other = new JwtTokenService({ ...config, secret: 'different-disposable-signing-key' });
  await assert.rejects(other.verifyAccessToken(tokens.accessToken), UnauthorizedError);
  const expired = await new JwtTokenService({ ...config, accessExpiresIn: '-1s' }).issueAccessToken(identity);
  await assert.rejects(service.verifyAccessToken(expired), UnauthorizedError);
});

test('configuration rejects missing/default production signing keys without reading ambient environment', () => {
  assert.throws(() => loadConfig({ NODE_ENV: 'production' }), /JWT_SECRET/);
  assert.throws(() => loadConfig({ NODE_ENV: 'production', JWT_SECRET: 'your-super-secret-jwt-key' }), /JWT_SECRET/);
  const config = loadConfig({
    NODE_ENV: 'production', JWT_SECRET: 'explicit-test-only-key', PORT: '4321',
    CORS_ORIGIN: 'http://localhost:4322', DB_PATH: ':memory:',
  });
  assert.equal(config.isProduction, true);
  assert.equal(config.port, 4321);
  assert.equal(config.corsOrigin, 'http://localhost:4322');
  assert.equal(config.dbPath, ':memory:');
  assert.equal(config.jwt.secret, 'explicit-test-only-key');
  assert.equal(loadConfig({}).isProduction, false);
});
