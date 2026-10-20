import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Request, Response } from 'express';
import { ConflictError, NotFoundError, UnauthorizedError, ValidationError } from '../src/shared/domain/errors';
import { errorMiddleware } from '../src/foundation/http/errorMiddleware';

test('error middleware translates domain failures and sanitizes unexpected failures', (t) => {
  const logged = t.mock.method(console, 'error', () => {});
  for (const [error, expectedStatus, expectedMessage] of [
    [new ValidationError('Invalid input'), 400, 'Invalid input'],
    [new UnauthorizedError('Invalid credentials'), 401, 'Invalid credentials'],
    [new NotFoundError('Task not found'), 404, 'Task not found'],
    [new ConflictError('Email is already registered'), 409, 'Email is already registered'],
    [new Error('Private database details'), 500, 'Internal server error'],
  ] as const) {
    let statusCode: number | undefined;
    let payload: unknown;
    const response = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(body: unknown) {
        payload = body;
        return this;
      },
    } as unknown as Response;
    errorMiddleware(error, {} as Request, response, () => assert.fail('Error was not handled'));
    assert.equal(statusCode, expectedStatus);
    assert.deepEqual(payload, { error: expectedMessage });
  }
  assert.equal(logged.mock.callCount(), 1);
});
