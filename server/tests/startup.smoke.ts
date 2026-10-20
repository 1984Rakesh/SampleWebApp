import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { once } from 'node:events';
import { createServer, type AddressInfo } from 'node:net';
import { devNull } from 'node:os';
import { resolve } from 'node:path';
import { test, type TestContext } from 'node:test';

async function availablePort(): Promise<number> {
  const probe = createServer().listen(0, '127.0.0.1');
  await once(probe, 'listening');
  const { port } = probe.address() as AddressInfo;
  await new Promise<void>((done, reject) => probe.close((error) => error ? reject(error) : done()));
  return port;
}

function launch(t: TestContext, port: number, secret?: string) {
  const child = spawn(process.execPath, [resolve(__dirname, '../dist/server.js')], {
    cwd: resolve(__dirname, '..'),
    env: {
      NODE_ENV: 'production', DB_PATH: ':memory:', PORT: String(port),
      CORS_ORIGIN: 'http://localhost:5173', DOTENV_CONFIG_PATH: devNull,
      ...(secret === undefined ? {} : { JWT_SECRET: secret }),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  let errors = '';
  child.stdout.setEncoding('utf8').on('data', (chunk: string) => { output += chunk; });
  child.stderr.setEncoding('utf8').on('data', (chunk: string) => { errors += chunk; });
  t.after(async () => {
    if (child.exitCode === null && child.signalCode === null) {
      const exited = once(child, 'exit');
      child.kill();
      await exited;
    }
  });
  return { child, output: () => output, errors: () => errors };
}

test('compiled production entry migrates and seeds before serving requests', { timeout: 15000 }, async (t) => {
  const port = await availablePort();
  const server = launch(t, port, randomUUID());
  await new Promise<void>((ready, reject) => {
    server.child.once('error', reject);
    server.child.once('exit', () => reject(new Error('Server exited before startup')));
    server.child.stdout.on('data', () => {
      if (server.output().includes(`Server is running on port ${port}`)) ready();
    });
  });
  assert.ok(server.output().indexOf('Migrations completed successfully') >= 0);
  assert.ok(server.output().indexOf('Database seeded successfully') > server.output().indexOf('Migrations completed successfully'));
  assert.ok(server.output().indexOf('Server is running') > server.output().indexOf('Database seeded successfully'));
  const base = `http://127.0.0.1:${port}`;
  const health = await fetch(`${base}/health`, { signal: AbortSignal.timeout(5000) });
  assert.equal(health.status, 200);
  const healthBody = await health.json() as { status: string; timestamp: string };
  assert.equal(healthBody.status, 'ok');
  assert.ok(Number.isFinite(Date.parse(healthBody.timestamp)));
  const preflight = await fetch(`${base}/api/tasks`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'http://localhost:5173',
      'Access-Control-Request-Method': 'PUT',
      'Access-Control-Request-Headers': 'authorization,content-type',
    },
    signal: AbortSignal.timeout(5000),
  });
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get('access-control-allow-origin'), 'http://localhost:5173');
  assert.equal(preflight.headers.get('access-control-allow-credentials'), 'true');
  assert.match(preflight.headers.get('access-control-allow-methods') ?? '', /PUT/);
  assert.match(preflight.headers.get('access-control-allow-headers') ?? '', /authorization/);
  const login = await fetch(`${base}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@example.com', password: 'password123' }),
    signal: AbortSignal.timeout(5000),
  });
  assert.equal(login.status, 200);
  const session = await login.json() as { accessToken: string };
  const tasks = await fetch(`${base}/api/tasks`, {
    headers: { Authorization: `Bearer ${session.accessToken}` }, signal: AbortSignal.timeout(5000),
  });
  assert.equal(tasks.status, 200);
  assert.equal((await tasks.json() as unknown[]).length, 4);
  assert.equal(server.errors(), '');
});

for (const secret of [undefined, 'your-super-secret-jwt-key']) {
  test(`compiled production entry rejects ${secret === undefined ? 'missing' : 'default'} JWT configuration before database startup`, { timeout: 10000 }, async (t) => {
    const server = launch(t, await availablePort(), secret);
    const [code] = await once(server.child, 'close', { signal: t.signal });
    assert.equal(code, 1);
    assert.match(server.errors(), /JWT_SECRET must be explicitly configured in production/);
    assert.equal(server.output().includes('Migrations completed successfully'), false);
    assert.equal(server.output().includes('Server is running'), false);
  });
}
