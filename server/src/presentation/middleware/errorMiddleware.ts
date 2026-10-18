import type { NextFunction, Request, Response } from 'express';
import {
  ConflictError,
  DomainError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../../domain/errors';

function statusForDomainError(error: DomainError): number {
  if (error instanceof ValidationError) return 400;
  if (error instanceof UnauthorizedError) return 401;
  if (error instanceof NotFoundError) return 404;
  if (error instanceof ConflictError) return 409;
  return 500;
}

interface HttpClientError {
  status: number;
  type?: string;
  expose: true;
}

function isHttpClientError(error: unknown): error is HttpClientError {
  if (typeof error !== 'object' || error === null) return false;
  const { status, expose } = error as Partial<HttpClientError>;
  return typeof status === 'number' && status >= 400 && status < 500 && expose === true;
}

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof DomainError) {
    const status = statusForDomainError(error);
    res.status(status).json({ error: status === 500 ? 'Internal server error' : error.message });
    return;
  }

  if (isHttpClientError(error)) {
    const message = error.type === 'entity.parse.failed' ? 'Invalid JSON body' : 'Invalid request';
    res.status(error.status).json({ error: message });
    return;
  }

  console.error('Unexpected error:', error);
  res.status(500).json({ error: 'Internal server error' });
}
