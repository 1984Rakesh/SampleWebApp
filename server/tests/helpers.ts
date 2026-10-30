import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { once } from 'node:events';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import type { TestContext } from 'node:test';
import { loadConfig } from '../src/app/config';
import { createComposition } from '../src/app/composition';
import { createApp } from '../src/app/createApp';
import { runMigrations } from '../src/foundation/database/migrations';
import type { AuthResponse } from '../src/security/presentation/schemas/AuthDto';

export async function createTestServer(t: TestContext) {
  const config = loadConfig({
    NODE_ENV: 'production',
    JWT_SECRET: randomUUID(),
    DB_PATH: ':memory:',
  });
  const composition = createComposition(config);
  const server = createServer(createApp(config, composition));
  t.after(async () => {
    if (server.listening) {
      const closed = once(server, 'close');
      server.close();
      server.closeAllConnections();
      await closed;
    }
    composition.db.close();
  });
  runMigrations(composition.db);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const { port } = server.address() as AddressInfo;

  async function request<T = unknown>(
    path: string,
    options: { method?: string; body?: unknown; token?: string; rawBody?: string } = {}
  ): Promise<{ status: number; body: T }> {
    const response = await fetch(`http://127.0.0.1:${port}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      body: options.rawBody ?? (options.body === undefined ? undefined : JSON.stringify(options.body)),
      signal: AbortSignal.timeout(5000),
    });
    const text = await response.text();
    return { status: response.status, body: (text ? JSON.parse(text) : undefined) as T };
  }

  async function register(email = `${randomUUID()}@example.test`): Promise<AuthResponse> {
    const response = await request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: { name: 'Test User', email, password: 'test-password-123' },
    });
    assert.equal(response.status, 201);
    return response.body;
  }

  return { request, register, config, seed: composition.seed };
}

export function assertError(response: { status: number; body: unknown }, status: number): void {
  assert.equal(response.status, status);
  assert.ok(response.body && typeof response.body === 'object');
  assert.deepEqual(Object.keys(response.body), ['error']);
  assert.equal(typeof (response.body as { error: unknown }).error, 'string');
  assert.ok((response.body as { error: string }).error.length > 0);
}

export function assertUtcTimestamp(value: string): void {
  assert.match(value, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/);
  assert.ok(Number.isFinite(Date.parse(value)));
}
