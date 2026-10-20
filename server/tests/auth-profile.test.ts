import assert from 'node:assert/strict';
import { test } from 'node:test';
import { JwtTokenService } from '../src/security/infrastructure/security/JwtTokenService';
import type { AuthResponse, RefreshResponse } from '../src/security/presentation/schemas/AuthDto';
import type { ProfileResponse } from '../src/profile/presentation/schemas/ProfileDto';
import { assertError, assertUtcTimestamp, createTestServer } from './helpers';

const userKeys = ['avatar', 'bio', 'createdAt', 'email', 'id', 'name'];

test('registration and login preserve normalized, credential-free auth DTOs', async (t) => {
  const { request } = await createTestServer(t);
  const registered = await request<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: { name: '  Test User  ', email: ' TEST@EXAMPLE.TEST ', password: 'test-password-123' },
  });
  assert.equal(registered.status, 201);
  const session = registered.body;
  assert.deepEqual(Object.keys(session).sort(), ['accessToken', 'refreshToken', 'user']);
  assert.deepEqual(Object.keys(session.user).sort(), userKeys);
  assert.equal(session.user.name, 'Test User');
  assert.equal(session.user.email, 'test@example.test');
  assert.equal(session.user.avatar, null);
  assert.equal(session.user.bio, null);
  assert.ok(session.user.id);
  assertUtcTimestamp(session.user.createdAt);
  assert.equal(typeof session.accessToken, 'string');
  assert.equal(typeof session.refreshToken, 'string');
  assert.notEqual(session.accessToken, session.refreshToken);

  const loggedIn = await request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: { email: ' TEST@EXAMPLE.TEST ', password: 'test-password-123' },
  });
  assert.equal(loggedIn.status, 200);
  assert.deepEqual(loggedIn.body.user, session.user);

  const duplicate = await request('/api/auth/register', {
    method: 'POST',
    body: { name: 'Another User', email: 'test@example.test', password: 'test-password-123' },
  });
  assertError(duplicate, 409);
  assert.deepEqual(duplicate.body, { error: 'Email is already registered' });
  for (const credentials of [
    { email: 'test@example.test', password: 'wrong-password' },
    { email: 'missing@example.test', password: 'test-password-123' },
  ]) {
    const response = await request('/api/auth/login', { method: 'POST', body: credentials });
    assertError(response, 401);
    assert.deepEqual(response.body, { error: 'Invalid credentials' });
  }
});

test('auth validates required fields, email, names and password length', async (t) => {
  const { request } = await createTestServer(t);
  for (const body of [
    {},
    { name: ' ', email: 'test@example.test', password: 'test-password-123' },
    { name: 'User', email: 'invalid', password: 'test-password-123' },
    { name: 'User', email: 'test@example.test', password: '12345' },
  ]) {
    assertError(await request('/api/auth/register', { method: 'POST', body }), 400);
  }
  assertError(await request('/api/auth/login', { method: 'POST', body: {} }), 400);
  assertError(await request('/api/auth/refresh', { method: 'POST', body: {} }), 400);
  const malformed = await request('/api/auth/login', { method: 'POST', rawBody: '{' });
  assertError(malformed, 400);
  assert.deepEqual(malformed.body, { error: 'Invalid JSON body' });
});

test('protected routes accept only valid access tokens', async (t) => {
  const { request, register, config } = await createTestServer(t);
  const session = await register();
  const expiredTokens = await new JwtTokenService({
    ...config.jwt,
    accessExpiresIn: '-1s',
  }).issueTokens({ userId: session.user.id, email: session.user.email });
  for (const path of ['/api/users/me', '/api/tasks']) {
    for (const token of [undefined, 'invalid-token', session.refreshToken, expiredTokens.accessToken]) {
      assertError(await request(path, { token }), 401);
    }
    assert.equal((await request(path, { token: session.accessToken })).status, 200);
  }
});

test('refresh checks token type, expiry and account existence', async (t) => {
  const { request, register, config } = await createTestServer(t);
  const session = await register();
  const refreshed = await request<RefreshResponse>('/api/auth/refresh', {
    method: 'POST',
    body: { refreshToken: session.refreshToken },
  });
  assert.equal(refreshed.status, 200);
  assert.deepEqual(Object.keys(refreshed.body), ['accessToken']);
  const profile = await request<ProfileResponse>('/api/users/me', { token: refreshed.body.accessToken });
  assert.equal(profile.status, 200);
  assert.deepEqual(profile.body, session.user);

  const missingUser = await new JwtTokenService(config.jwt).issueTokens({
    userId: 'nonexistent-test-user',
    email: 'missing@example.test',
  });
  const expired = await new JwtTokenService({ ...config.jwt, refreshExpiresIn: '-1s' }).issueTokens({
    userId: session.user.id,
    email: session.user.email,
  });
  for (const refreshToken of [
    session.accessToken,
    'invalid-token',
    missingUser.refreshToken,
    expired.refreshToken,
  ]) {
    assertError(await request('/api/auth/refresh', { method: 'POST', body: { refreshToken } }), 401);
  }
});

test('login reflects profile changes without exposing credential data or changing the session contract', async (t) => {
  const { request, register } = await createTestServer(t);
  const session = await register();
  const updated = await request<ProfileResponse>('/api/users/me', {
    method: 'PUT', token: session.accessToken,
    body: { name: 'Updated Name', bio: 'Updated bio', avatar: 'updated.png' },
  });
  assert.equal(updated.status, 200);
  const login = await request<AuthResponse>('/api/auth/login', {
    method: 'POST', body: { email: session.user.email, password: 'test-password-123' },
  });
  assert.equal(login.status, 200);
  assert.deepEqual(Object.keys(login.body).sort(), ['accessToken', 'refreshToken', 'user']);
  assert.deepEqual(Object.keys(login.body.user).sort(), userKeys);
  assert.deepEqual(login.body.user, updated.body);
  const current = await request<ProfileResponse>('/api/users/me', { token: login.body.accessToken });
  assert.equal(current.status, 200);
  assert.deepEqual(current.body, updated.body);
});

test('profile reads and updates return 404 for a verified identity without an account', async (t) => {
  const { request, config } = await createTestServer(t);
  const token = await new JwtTokenService(config.jwt).issueAccessToken({
    userId: 'nonexistent-test-user', email: 'missing@example.test',
  });
  assertError(await request('/api/users/me', { token }), 404);
  assertError(await request('/api/users/me', { method: 'PUT', token, body: { bio: 'Missing' } }), 404);
});

test('profile updates normalize values, preserve omitted fields and clear optional values', async (t) => {
  const { request, register } = await createTestServer(t);
  const session = await register();
  const other = await register();
  const token = session.accessToken;
  const update = (body: unknown) => request<ProfileResponse>('/api/users/me', { method: 'PUT', token, body });
  const updated = await update({ name: '  New Name  ', bio: '  About me  ', avatar: '  avatar.png  ' });
  assert.equal(updated.status, 200);
  assert.deepEqual(Object.keys(updated.body).sort(), userKeys);
  assert.deepEqual(updated.body, { ...session.user, name: 'New Name', bio: 'About me', avatar: 'avatar.png' });
  const preserved = await update({});
  assert.equal(preserved.status, 200);
  assert.deepEqual(preserved.body, updated.body);
  const cleared = await update({ bio: null, avatar: '' });
  assert.equal(cleared.status, 200);
  assert.equal(cleared.body.bio, null);
  assert.equal(cleared.body.avatar, null);
  assert.equal(cleared.body.name, 'New Name');
  await update({ bio: 'Again', avatar: 'again.png' });
  const clearedOtherWay = await update({ bio: '   ', avatar: null });
  assert.equal(clearedOtherWay.status, 200);
  assert.equal(clearedOtherWay.body.bio, null);
  assert.equal(clearedOtherWay.body.avatar, null);
  assertError(await update({ name: ' ' }), 400);
  const spoofed = await update({ userId: other.user.id, email: other.user.email, name: 'Own Profile' });
  assert.equal(spoofed.status, 200);
  assert.equal(spoofed.body.id, session.user.id);
  assert.equal(spoofed.body.email, session.user.email);
  const untouched = await request<ProfileResponse>('/api/users/me', { token: other.accessToken });
  assert.equal(untouched.status, 200);
  assert.deepEqual(untouched.body, other.user);
});
