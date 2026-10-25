import assert from 'node:assert/strict';
import { test } from 'node:test';
import { randomUUID } from 'node:crypto';
import type { AuthResponseDTO } from '../../client/src/security/data/dtos/AuthDTO';
import type { TaskDTO } from '../../client/src/tasks/data/dtos/TaskDTO';
import type { ProfileDTO } from '../../client/src/profile/data/dtos/ProfileDTO';
import { refreshTokenResponseSchema } from '../../client/src/security/data/dtos/schemas';
import { toDomain as authToDomain, toLoginRequestDTO, toRegisterRequestDTO } from '../../client/src/security/data/mappers/AuthMapper';
import { toDomain as taskToDomain, toCreateTaskDTO, toUpdateTaskDTO } from '../../client/src/tasks/data/mappers/TaskMapper';
import { toDomain as userToDomain, toUpdateProfileDTO } from '../../client/src/profile/data/mappers/ProfileMapper';
import { assertError, createTestServer } from './helpers';

const HIGH_PRIORITY = 'HIGH' as Parameters<typeof toCreateTaskDTO>[0]['priority'];

test('client feature request and response mappers preserve compatibility with server endpoints', async (t) => {
  const { request } = await createTestServer(t);
  const credentials = { email: `${randomUUID()}@example.test`, password: 'test-password-123' };
  const registered = await request<AuthResponseDTO>('/api/auth/register', {
    method: 'POST', body: toRegisterRequestDTO({ ...credentials, name: 'Contract User' }),
  });
  assert.equal(registered.status, 201);
  const session = authToDomain(registered.body);
  assert.equal(session.user.name, 'Contract User');
  assert.equal(session.user.bio, undefined);
  assert.equal(session.user.avatar, undefined);
  const loggedIn = await request<AuthResponseDTO>('/api/auth/login', {
    method: 'POST', body: toLoginRequestDTO(credentials),
  });
  assert.equal(loggedIn.status, 200);
  const token = authToDomain(loggedIn.body).accessToken;
  const current = await request<ProfileDTO>('/api/users/me', { token });
  assert.equal(current.status, 200);
  const currentProfile = userToDomain(current.body);
  assert.notEqual(currentProfile.constructor, session.user.constructor);
  assert.deepEqual({ ...currentProfile }, { ...session.user });
  const profile = await request<ProfileDTO>('/api/users/me', {
    method: 'PUT', token, body: toUpdateProfileDTO({ name: 'New Name', bio: 'Bio', avatar: 'avatar.png' }),
  });
  assert.equal(profile.status, 200);
  assert.equal(userToDomain(profile.body).name, 'New Name');
  assert.equal(userToDomain(profile.body).bio, 'Bio');
  const clearedProfile = await request<ProfileDTO>('/api/users/me', {
    method: 'PUT', token, body: toUpdateProfileDTO({ bio: '', avatar: '' }),
  });
  assert.equal(clearedProfile.status, 200);
  assert.equal(userToDomain(clearedProfile.body).bio, undefined);
  assert.equal(userToDomain(clearedProfile.body).avatar, undefined);

  const created = await request<TaskDTO>('/api/tasks', {
    method: 'POST', token,
    body: toCreateTaskDTO({ title: 'Contract task', priority: HIGH_PRIORITY, description: 'Details' }),
  });
  assert.equal(created.status, 201);
  const task = taskToDomain(created.body);
  assert.equal(task.userId, session.user.id);
  assert.equal(task.status, 'TODO');
  assert.equal(task.priority, 'HIGH');
  const updated = await request<TaskDTO>(`/api/tasks/${task.id}`, {
    method: 'PUT', token, body: toUpdateTaskDTO({ title: 'Updated task', description: '', dueDate: '' }),
  });
  assert.equal(updated.status, 200);
  assert.equal(taskToDomain(updated.body).description, undefined);
  assert.equal(taskToDomain(updated.body).dueDate, undefined);
  const toggled = await request<TaskDTO>(`/api/tasks/${task.id}/status`, {
    method: 'PATCH', token, body: { status: 'COMPLETED' },
  });
  assert.equal(toggled.status, 200);
  assert.equal(taskToDomain(toggled.body).status, 'COMPLETED');
  const filters = new URLSearchParams({ status: 'COMPLETED', priority: 'HIGH' });
  const listed = await request<TaskDTO[]>(`/api/tasks?${filters}`, { token });
  assert.equal(listed.status, 200);
  assert.deepEqual(listed.body.map(taskToDomain).map((item) => item.id), [task.id]);

  const refreshed = await request('/api/auth/refresh', {
    method: 'POST', body: { refreshToken: session.refreshToken },
  });
  assert.equal(refreshed.status, 200);
  const refreshedToken = refreshTokenResponseSchema.parse(refreshed.body).accessToken;
  const authorized = await request<ProfileDTO>('/api/users/me', { token: refreshedToken });
  assert.equal(authorized.status, 200);
  assert.equal(userToDomain(authorized.body).name, 'New Name');
  const deleted = await request(`/api/tasks/${task.id}`, { method: 'DELETE', token });
  assert.equal(deleted.status, 204);
  assert.equal(deleted.body, undefined);
  const denied = await request('/api/auth/login', {
    method: 'POST', body: toLoginRequestDTO({ ...credentials, password: 'wrong-password' }),
  });
  assertError(denied, 401);
  assert.deepEqual(denied.body, { error: 'Invalid credentials' });
});
