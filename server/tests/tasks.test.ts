import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { TaskResponse } from '../src/tasks/presentation/schemas/TaskDto';
import { assertError, assertUtcTimestamp, createTestServer } from './helpers';

test('task CRUD, filters and status changes preserve the HTTP contract', async (t) => {
  const { request, register } = await createTestServer(t);
  const session = await register();
  const token = session.accessToken;
  const created = await request<TaskResponse>('/api/tasks', {
    method: 'POST', token,
    body: { title: '  First task  ', description: '  Details  ', dueDate: '2026-11-01T12:00:00Z' },
  });
  assert.equal(created.status, 201);
  const task = created.body;
  assert.deepEqual(Object.keys(task).sort(), [
    'createdAt', 'description', 'dueDate', 'id', 'priority', 'status', 'title', 'updatedAt', 'userId',
  ]);
  assert.ok(task.id);
  assert.equal(task.title, 'First task');
  assert.equal(task.description, 'Details');
  assert.equal(task.dueDate, '2026-11-01T12:00:00Z');
  assert.equal(task.status, 'TODO');
  assert.equal(task.priority, 'MEDIUM');
  assert.equal(task.userId, session.user.id);
  assertUtcTimestamp(task.createdAt);
  assertUtcTimestamp(task.updatedAt);

  const second = await request<TaskResponse>('/api/tasks', {
    method: 'POST', token, body: { title: 'Second task', priority: 'HIGH' },
  });
  assert.equal(second.status, 201);
  assert.equal(second.body.description, null);
  assert.equal(second.body.dueDate, null);
  const updated = await request<TaskResponse>(`/api/tasks/${task.id}`, {
    method: 'PUT', token, body: { title: '  Renamed  ', priority: 'LOW', status: 'IN_PROGRESS' },
  });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.title, 'Renamed');
  assert.equal(updated.body.priority, 'LOW');
  assert.equal(updated.body.status, 'IN_PROGRESS');
  assert.equal(updated.body.description, task.description);
  assert.equal(updated.body.dueDate, task.dueDate);
  assertUtcTimestamp(updated.body.updatedAt);

  for (const [query, ids] of [
    ['', [task.id, second.body.id]],
    ['?status=IN_PROGRESS', [task.id]],
    ['?priority=HIGH', [second.body.id]],
    ['?status=IN_PROGRESS&priority=LOW', [task.id]],
    ['?status=COMPLETED&priority=HIGH', []],
  ] as const) {
    const listed = await request<TaskResponse[]>(`/api/tasks${query}`, { token });
    assert.equal(listed.status, 200);
    assert.deepEqual(listed.body.map((item) => item.id).sort(), [...ids].sort());
  }
  const toggled = await request<TaskResponse>(`/api/tasks/${task.id}/status`, {
    method: 'PATCH', token, body: { status: 'COMPLETED' },
  });
  assert.equal(toggled.status, 200);
  assert.equal(toggled.body.status, 'COMPLETED');
  const deleted = await request(`/api/tasks/${task.id}`, { method: 'DELETE', token });
  assert.equal(deleted.status, 204);
  assert.equal(deleted.body, undefined);
  const remaining = await request<TaskResponse[]>('/api/tasks', { token });
  assert.equal(remaining.status, 200);
  assert.deepEqual(remaining.body.map((item) => item.id), [second.body.id]);
  assertError(await request(`/api/tasks/${task.id}`, { method: 'PUT', token, body: { title: 'Missing' } }), 404);
});

test('task optional fields distinguish omission, null, empty and new values', async (t) => {
  const { request, register } = await createTestServer(t);
  const { accessToken: token } = await register();
  const created = await request<TaskResponse>('/api/tasks', {
    method: 'POST', token,
    body: { title: 'Task', description: 'Description', dueDate: '2026-11-01T12:00:00Z' },
  });
  assert.equal(created.status, 201);
  const update = (body: unknown) => request<TaskResponse>(`/api/tasks/${created.body.id}`, { method: 'PUT', token, body });
  const omitted = await update({});
  assert.equal(omitted.status, 200);
  assert.equal(omitted.body.description, created.body.description);
  assert.equal(omitted.body.dueDate, created.body.dueDate);
  const cleared = await update({ description: null, dueDate: '' });
  assert.equal(cleared.status, 200);
  assert.equal(cleared.body.description, null);
  assert.equal(cleared.body.dueDate, null);
  const restored = await update({ description: '  Restored  ', dueDate: '2026-12-01T00:00:00Z' });
  assert.equal(restored.status, 200);
  assert.equal(restored.body.description, 'Restored');
  assert.equal(restored.body.dueDate, '2026-12-01T00:00:00Z');
  const clearedOtherWay = await update({ description: ' ', dueDate: null });
  assert.equal(clearedOtherWay.status, 200);
  assert.equal(clearedOtherWay.body.description, null);
  assert.equal(clearedOtherWay.body.dueDate, null);
});

test('task operations scope identity to the bearer token and hide other users tasks', async (t) => {
  const { request, register } = await createTestServer(t);
  const owner = await register();
  const other = await register();
  const created = await request<TaskResponse>('/api/tasks', {
    method: 'POST', token: owner.accessToken,
    body: { title: 'Private task', userId: other.user.id },
  });
  assert.equal(created.status, 201);
  assert.equal(created.body.userId, owner.user.id);
  const listed = await request<TaskResponse[]>('/api/tasks', { token: other.accessToken });
  assert.equal(listed.status, 200);
  assert.deepEqual(listed.body, []);
  for (const id of [created.body.id, 'missing-task']) {
    for (const options of [
      { method: 'PUT', body: { title: 'Not yours', userId: owner.user.id } },
      { method: 'DELETE' },
    ]) {
      assertError(await request(`/api/tasks/${id}`, { ...options, token: other.accessToken }), 404);
    }
    assertError(await request(`/api/tasks/${id}/status`, {
      method: 'PATCH', token: other.accessToken, body: { status: 'COMPLETED' },
    }), 404);
  }
  const owned = await request<TaskResponse[]>('/api/tasks', { token: owner.accessToken });
  assert.equal(owned.status, 200);
  assert.deepEqual(owned.body, [created.body]);
});

test('invalid task mutations and filters return validation error envelopes', async (t) => {
  const { request, register } = await createTestServer(t);
  const { accessToken: token } = await register();
  for (const body of [{}, { title: ' ' }, { title: 'Task', priority: 'INVALID' }]) {
    assertError(await request('/api/tasks', { method: 'POST', token, body }), 400);
  }
  const created = await request<TaskResponse>('/api/tasks', { method: 'POST', token, body: { title: 'Valid' } });
  assert.equal(created.status, 201);
  for (const body of [{ title: ' ' }, { status: 'INVALID' }, { priority: 'INVALID' }]) {
    assertError(await request(`/api/tasks/${created.body.id}`, { method: 'PUT', token, body }), 400);
  }
  assertError(await request(`/api/tasks/${created.body.id}/status`, {
    method: 'PATCH', token, body: { status: 'INVALID' },
  }), 400);
  for (const query of ['?status=INVALID', '?priority=INVALID']) {
    assertError(await request(`/api/tasks${query}`, { token }), 400);
  }
});
