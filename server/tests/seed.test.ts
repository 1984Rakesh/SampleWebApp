import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createDatabase } from '../src/foundation/database/connection';
import { runMigrations } from '../src/foundation/database/migrations';
import { seedDatabase } from '../src/foundation/database/seed';
import type { AuthResponse } from '../src/security/presentation/schemas/AuthDto';
import type { TaskResponse } from '../src/tasks/presentation/schemas/TaskDto';
import { createTestServer } from './helpers';

test('App-wired seed preserves demo login and tasks and skips an already populated database', async (t) => {
  const { request, seed } = await createTestServer(t);
  await seed();
  const login = await request<AuthResponse>('/api/auth/login', {
    method: 'POST', body: { email: 'demo@example.com', password: 'password123' },
  });
  assert.equal(login.status, 200);
  assert.equal(login.body.user.id, 'user-1');
  assert.equal(login.body.user.name, 'Demo User');
  assert.equal(login.body.user.bio, 'iOS developer learning web architecture');
  const token = login.body.accessToken;
  const tasks = await request<TaskResponse[]>('/api/tasks', { token });
  assert.equal(tasks.status, 200);
  assert.deepEqual(tasks.body.map(({ id, title, status, priority, userId }) => ({ id, title, status, priority, userId }))
    .sort((left, right) => left.id.localeCompare(right.id)), [
    { id: 'task-1', title: 'Learn Clean Architecture', status: 'COMPLETED', priority: 'HIGH', userId: 'user-1' },
    { id: 'task-2', title: 'Setup React project', status: 'IN_PROGRESS', priority: 'HIGH', userId: 'user-1' },
    { id: 'task-3', title: 'Implement domain layer', status: 'TODO', priority: 'MEDIUM', userId: 'user-1' },
    { id: 'task-4', title: 'Build comparison UI', status: 'TODO', priority: 'LOW', userId: 'user-1' },
  ]);
  await seed();
  const repeated = await request<TaskResponse[]>('/api/tasks', { token });
  assert.equal(repeated.status, 200);
  assert.deepEqual(repeated.body, tasks.body);
});

test('foundation seed awaits the injected hasher and does not hash again when users exist', async (t) => {
  const db = createDatabase(':memory:');
  t.after(() => db.close());
  runMigrations(db);
  let calls = 0;
  await seedDatabase(db, async (password) => {
    calls++;
    assert.equal(password, 'password123');
    await Promise.resolve();
    return 'test-only-hash';
  });
  assert.equal(calls, 1);
  assert.deepEqual(db.prepare('SELECT password_hash FROM users WHERE id = ?').get('user-1'), {
    password_hash: 'test-only-hash',
  });
  await seedDatabase(db, async () => assert.fail('Existing database must not be reseeded'));
  assert.equal(calls, 1);
});

test('foundation seed propagates hashing failures without creating partial records', async (t) => {
  const db = createDatabase(':memory:');
  t.after(() => db.close());
  runMigrations(db);
  const failure = new Error('Hasher unavailable');
  await assert.rejects(seedDatabase(db, async () => { throw failure; }), (error) => error === failure);
  assert.deepEqual(db.prepare('SELECT COUNT(*) AS count FROM users').get(), { count: 0 });
  assert.deepEqual(db.prepare('SELECT COUNT(*) AS count FROM tasks').get(), { count: 0 });
});
