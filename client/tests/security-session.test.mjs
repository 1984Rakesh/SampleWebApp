import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { AxiosError } from 'axios';
import { createServer } from 'vite';

let vite;
let network;
let errors;
let BrowserSessionRepository;
let refreshAccessTokenUseCase;
let signOutUseCase;
let updateProfileUseCase;
let registerUserUseCase;
let loginUseCase;
let profileMapper;
let authMapper;
let authApi;
let authData;
let profileSession;
let boundary;

before(async () => {
  vite = await createServer({ server: { middlewareMode: true, watch: null, hmr: false }, appType: 'custom' });
  const load = (path) => vite.ssrLoadModule(`/src/${path}`);
  network = await load('foundation/network/axiosClient.ts');
  errors = await load('shared/domain/errors.ts');
  boundary = await load('shared/data/translateError.ts');
  ({ BrowserSessionRepository } = await load('security/data/repositories/BrowserSessionRepository.ts'));
  ({ refreshAccessTokenUseCase } = await load('security/domain/useCases/RefreshAccessTokenUseCase.ts'));
  ({ signOutUseCase } = await load('security/domain/useCases/SignOutUseCase.ts'));
  ({ updateProfileUseCase } = await load('profile/domain/useCases/UpdateProfileUseCase.ts'));
  ({ registerUserUseCase } = await load('security/domain/useCases/RegisterUserUseCase.ts'));
  ({ loginUseCase } = await load('security/domain/useCases/LoginUseCase.ts'));
  profileMapper = await load('profile/data/mappers/ProfileMapper.ts');
  authMapper = await load('security/data/mappers/AuthMapper.ts');
  authApi = await load('security/data/api/AuthApi.ts');
  authData = await load('security/data/repositories/HttpAuthRepository.ts');
  profileSession = await load('app/composition/profileSession.ts');
});
after(async () => { await vite?.close(); });

const user = { id: 'user-1', name: 'Test User', email: 'test@example.test', bio: 'Bio', avatar: null, createdAt: '2026-10-20T03:00:00Z' };
const fixture = () => ({ user: { ...user }, accessToken: 'old-access', refreshToken: 'refresh-token' });
function storage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return { getItem: (key) => map.get(key) ?? null, setItem: (key, value) => map.set(key, value), removeItem: (key) => map.delete(key) };
}
function store() {
  const values = storage();
  const sessions = new BrowserSessionRepository(values);
  sessions.saveSession(fixture());
  return { sessions, values };
}
function denied(config, status = 401, message = 'Access expired') {
  return new AxiosError(message, 'ERR_BAD_RESPONSE', config, undefined, {
    status, statusText: 'Rejected', data: { error: message }, headers: {}, config,
  });
}
function success(config, data = {}) { return { status: 200, statusText: 'OK', headers: {}, config, data }; }
function authPort(refreshToken) {
  return { refreshToken, login: async () => assert.fail('Unexpected login'), register: async () => assert.fail('Unexpected register') };
}
function configure(transport, sessions, refresh) {
  let expirations = 0;
  transport.configureAuthentication({
    getAccessToken: () => sessions.getSession()?.accessToken ?? null,
    getVersion: sessions.getVersion,
    refreshAccessToken: refresh,
    onSessionExpired: () => { expirations++; signOutUseCase(sessions); },
    isPublicRequest: authApi.isAuthenticationRequest,
  });
  return () => expirations;
}
function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
const tick = () => new Promise((resolve) => setImmediate(resolve));

test('security domain normalizes credentials and validates before calling adapters', async () => {
  let received;
  const repository = { ...authPort(async () => ''),
    register: async (input) => { received = input; return fixture(); },
    login: async (input) => { received = input; return fixture(); },
  };
  await registerUserUseCase(repository, { name: '  Name  ', email: ' TEST@EXAMPLE.TEST ', password: '123456' });
  assert.deepEqual(received, { name: 'Name', email: 'test@example.test', password: '123456' });
  await loginUseCase(repository, { email: ' TEST@EXAMPLE.TEST ', password: '123456' });
  assert.deepEqual(received, { email: 'test@example.test', password: '123456' });
  const unexpected = { ...repository, register: async () => assert.fail('Invalid registration reached adapter') };
  await assert.rejects(registerUserUseCase(unexpected, { name: ' ', email: user.email, password: '123456' }), errors.ValidationError);
  await assert.rejects(registerUserUseCase(unexpected, { name: 'Name', email: user.email, password: 'short' }), errors.ValidationError);
  await assert.rejects(loginUseCase(repository, { email: 'invalid', password: '123456' }), errors.ValidationError);
});

test('profile domain and DTO mapping preserve omitted, null, empty and new values', async () => {
  const seen = [];
  const repository = { getCurrentUser: async () => user, updateProfile: async (input) => { seen.push(profileMapper.toUpdateProfileDTO(input)); return user; } };
  await updateProfileUseCase(repository, {});
  await updateProfileUseCase(repository, { bio: null, avatar: '' });
  await updateProfileUseCase(repository, { name: ' New Name ', bio: ' Bio ', avatar: ' image.png ' });
  assert.deepEqual(seen, [
    { name: undefined, bio: undefined, avatar: undefined },
    { name: undefined, bio: null, avatar: null },
    { name: 'New Name', bio: 'Bio', avatar: 'image.png' },
  ]);
  await assert.rejects(updateProfileUseCase(repository, { name: ' ' }), errors.ValidationError);
  assert.equal(seen.length, 3);
});

test('session adapter hydrates compatible storage, caches snapshots and clears corrupt or partial state', () => {
  const values = storage({ accessToken: 'access', refreshToken: 'refresh', user: JSON.stringify(user) });
  const sessions = new BrowserSessionRepository(values);
  const first = sessions.getSession();
  assert.equal(first.user.id, user.id);
  assert.equal(first.user.avatar, undefined);
  assert.strictEqual(sessions.getSession(), first);
  let notifications = 0;
  const unsubscribe = sessions.subscribe(() => { notifications++; });
  sessions.updateAccount({ ...first.user, name: 'Changed' });
  assert.equal(sessions.getSession().user.name, 'Changed');
  assert.equal(JSON.parse(values.getItem('user')).name, 'Changed');
  sessions.clearSession();
  assert.equal(sessions.getSession(), null);
  assert.equal(notifications, 2);
  unsubscribe();
  for (const invalid of ['{invalid', JSON.stringify({ ...user, id: '' })]) {
    values.setItem('accessToken', 'access'); values.setItem('refreshToken', 'refresh'); values.setItem('user', invalid);
    assert.equal(sessions.getSession(), null);
    for (const key of ['accessToken', 'refreshToken', 'user']) assert.equal(values.getItem(key), null);
  }
  values.setItem('accessToken', 'orphan');
  assert.equal(sessions.getSession(), null);
  assert.equal(values.getItem('accessToken'), null);
});

test('protected concurrent 401s share one refresh and retry each original request once', async () => {
  const { sessions } = store();
  const gate = deferred();
  let refreshes = 0;
  let requests = 0;
  const transport = network.createHttpClient({ adapter: async (config) => {
    requests++;
    if (config.headers.get('Authorization') !== 'Bearer new-access') throw denied(config);
    return success(config, { ok: true });
  } });
  const expireCount = configure(transport, sessions, () => refreshAccessTokenUseCase(authPort(async () => { refreshes++; return gate.promise; }), sessions));
  const pending = Promise.all([transport.client.get('/tasks'), transport.client.get('/users/me')]);
  await tick();
  assert.equal(refreshes, 1);
  gate.resolve('new-access');
  const responses = await pending;
  assert.ok(responses.every((response) => response.data.ok));
  assert.equal(requests, 4);
  assert.equal(expireCount(), 0);
  assert.equal(sessions.getSession().accessToken, 'new-access');
});

test('auth endpoint errors bypass refresh/expiry and translate backend errors into domain failures', async () => {
  const { sessions } = store();
  const transport = network.createHttpClient({ adapter: async (config) => { throw denied(config, 401, 'Invalid credentials'); } });
  let refreshes = 0;
  const expires = configure(transport, sessions, async () => { refreshes++; return 'token'; });
  const api = authApi.createAuthApi(transport.client, transport.client);
  for (const request of [
    () => api.login({ email: user.email, password: 'wrong' }),
    () => api.register({ name: 'Name', email: user.email, password: 'wrong' }),
    () => api.refreshToken('wrong'),
  ]) {
    await assert.rejects(request, (error) => error instanceof errors.UnauthorizedError && error.message === 'Invalid credentials');
  }
  assert.equal(refreshes, 0);
  assert.equal(expires(), 0);
  assert.ok(sessions.getSession());
});

test('refresh failure on non-intercepted transport clears the full session and notifies observers', async () => {
  const { sessions, values } = store();
  let requests = 0;
  let refreshes = 0;
  let notified = false;
  sessions.subscribe(() => { if (!sessions.getSession()) notified = true; });
  const transport = network.createHttpClient({ adapter: async (config) => { requests++; throw denied(config); } });
  const raw = network.createHttpClient({ adapter: async (config) => { refreshes++; throw denied(config, 401, 'Refresh expired'); } });
  const repository = authData.createAuthRepository(authApi.createAuthApi(transport.client, raw.client));
  const expires = configure(transport, sessions, () => refreshAccessTokenUseCase(repository, sessions));
  await assert.rejects(transport.client.get('/tasks'), /Refresh expired/);
  assert.equal(requests, 1);
  assert.equal(refreshes, 1);
  assert.equal(expires(), 1);
  assert.equal(notified, true);
  for (const key of ['accessToken', 'refreshToken', 'user']) assert.equal(values.getItem(key), null);
});

test('a missing persisted refresh token clears state and notifies reactive session consumers', async () => {
  const { sessions, values } = store();
  sessions.getSession();
  let notified = false;
  sessions.subscribe(() => { notified = sessions.getSession() === null; });
  values.removeItem('refreshToken');
  const transport = network.createHttpClient({ adapter: async (config) => { throw denied(config); } });
  configure(transport, sessions, () => refreshAccessTokenUseCase(authPort(async () => assert.fail('Missing refresh token reached transport')), sessions));
  await assert.rejects(transport.client.get('/tasks'));
  assert.equal(notified, true);
  assert.equal(sessions.getSession(), null);
});

test('malformed refresh responses expire the session without storing an empty access token', async () => {
  const { sessions } = store();
  const transport = network.createHttpClient({ adapter: async (config) => { throw denied(config); } });
  const raw = network.createHttpClient({ adapter: async (config) => success(config, { accessToken: '' }) });
  const repository = authData.createAuthRepository(authApi.createAuthApi(transport.client, raw.client));
  const expires = configure(transport, sessions, () => refreshAccessTokenUseCase(repository, sessions));
  await assert.rejects(transport.client.get('/tasks'), errors.DataError);
  assert.equal(expires(), 1);
  assert.equal(sessions.getSession(), null);
});

test('a late protected 401 from an old login cannot expire a newly logged-in session', async () => {
  const { sessions } = store();
  const gate = deferred();
  let refreshes = 0;
  const transport = network.createHttpClient({ adapter: async (config) => { await gate.promise; throw denied(config); } });
  const expires = configure(transport, sessions, async () => { refreshes++; return 'obsolete'; });
  const request = transport.client.get('/tasks');
  sessions.saveSession({ ...fixture(), user: { ...user, id: 'new-user' }, accessToken: 'new-session-access' });
  gate.resolve();
  await assert.rejects(request);
  assert.equal(refreshes, 0);
  assert.equal(expires(), 0);
  assert.equal(sessions.getSession().accessToken, 'new-session-access');
});

test('a second protected 401 expires the session without a refresh loop', async () => {
  const { sessions } = store();
  let requests = 0;
  let refreshes = 0;
  const transport = network.createHttpClient({ adapter: async (config) => { requests++; throw denied(config); } });
  const expires = configure(transport, sessions, () => refreshAccessTokenUseCase(authPort(async () => { refreshes++; return 'new-access'; }), sessions));
  await assert.rejects(transport.client.get('/tasks'), /Access expired/);
  assert.equal(requests, 2);
  assert.equal(refreshes, 1);
  assert.equal(expires(), 1);
  assert.equal(sessions.getSession(), null);
});

test('logout/new login during refresh cannot revive the old session or clear the new one', async () => {
  const { sessions } = store();
  const gate = deferred();
  let requests = 0;
  const transport = network.createHttpClient({ adapter: async (config) => { requests++; throw denied(config); } });
  const expires = configure(transport, sessions, () => refreshAccessTokenUseCase(authPort(() => gate.promise), sessions));
  const request = transport.client.get('/tasks');
  await tick();
  signOutUseCase(sessions);
  sessions.saveSession({ ...fixture(), user: { ...user, id: 'new-user' }, accessToken: 'new-session-access', refreshToken: 'new-refresh' });
  gate.resolve('old-session-access');
  await assert.rejects(request, /Session has ended/);
  assert.equal(requests, 1);
  assert.equal(expires(), 0);
  assert.equal(sessions.getSession().accessToken, 'new-session-access');
  assert.equal(sessions.getSession().user.id, 'new-user');
});

test('profile reads/updates synchronize explicitly to account snapshots and reject late results', async () => {
  const { sessions } = store();
  const profile = profileMapper.toDomain(user);
  const source = { getCurrentUser: async () => ({ ...profile, name: 'Read Name' }), updateProfile: async () => ({ ...profile, name: 'Updated Name', bio: undefined }) };
  const bound = profileSession.bindProfileSession(source, sessions);
  await bound.getCurrentUser();
  assert.equal(sessions.getSession().user.name, 'Read Name');
  await bound.updateProfile({ bio: null });
  assert.equal(sessions.getSession().user.name, 'Updated Name');
  assert.equal(sessions.getSession().user.bio, undefined);
  const gate = deferred();
  const slow = profileSession.bindProfileSession({ ...source, getCurrentUser: () => gate.promise }, sessions);
  const request = slow.getCurrentUser();
  signOutUseCase(sessions);
  sessions.saveSession({ ...fixture(), user: { ...user, id: 'new-user', name: 'New User' } });
  gate.resolve(profile);
  await assert.rejects(request, errors.UnauthorizedError);
  assert.equal(sessions.getSession().user.name, 'New User');
});

test('a profile read started before an update cannot overwrite the newer session/cache result', async () => {
  const { sessions } = store();
  const gate = deferred();
  const before = profileMapper.toDomain(user);
  const bound = profileSession.bindProfileSession({
    getCurrentUser: () => gate.promise,
    updateProfile: async () => ({ ...before, name: 'Newest Name' }),
  }, sessions);
  const read = bound.getCurrentUser();
  await bound.updateProfile({ name: 'Newest Name' });
  gate.resolve(before);
  assert.equal((await read).name, 'Newest Name');
  assert.equal(sessions.getSession().user.name, 'Newest Name');
});

test('a later failed profile mutation does not hide an earlier successful update', async () => {
  const { sessions } = store();
  const gate = deferred();
  const bound = profileSession.bindProfileSession({
    getCurrentUser: async () => profileMapper.toDomain(user),
    updateProfile: async (input) => {
      if (input.name === 'Successful') return gate.promise;
      throw new errors.ValidationError('Update rejected');
    },
  }, sessions);
  const first = bound.updateProfile({ name: 'Successful' });
  await assert.rejects(bound.updateProfile({ name: 'Rejected' }), errors.ValidationError);
  gate.resolve({ ...profileMapper.toDomain(user), name: 'Successful' });
  assert.equal((await first).name, 'Successful');
  assert.equal(sessions.getSession().user.name, 'Successful');
});

test('response validation and transport failures never leak raw Axios/Zod errors', () => {
  assert.throws(() => authMapper.toDomain({ ...fixture(), accessToken: '' }), errors.DataError);
  assert.throws(() => authMapper.refreshToDomain({ accessToken: '' }), errors.DataError);
  assert.throws(() => profileMapper.toDomain({ ...user, id: '' }), errors.DataError);
  for (const [status, ErrorType] of [[400, errors.ValidationError], [401, errors.UnauthorizedError], [404, errors.NotFoundError], [409, errors.ConflictError], [500, errors.DataError]]) {
    const translated = boundary.translateError(denied({}, status, 'Backend message'));
    assert.ok(translated instanceof ErrorType);
    assert.equal(translated.message, 'Backend message');
  }
});
