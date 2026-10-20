import { ZodError } from 'zod';
import { HttpError, toHttpError } from '../../foundation/network/axiosClient';
import { ConflictError, DataError, DomainError, NotFoundError, UnauthorizedError, ValidationError } from '../domain/errors';

export function translateError(error: unknown): DomainError {
  if (error instanceof DomainError) return error;
  if (error instanceof ZodError) return new DataError(error.issues[0]?.message ?? 'Invalid response');
  const translated = toHttpError(error);
  if (translated instanceof HttpError) {
    if (translated.status === 400) return new ValidationError(translated.message);
    if (translated.status === 401) return new UnauthorizedError(translated.message);
    if (translated.status === 404) return new NotFoundError(translated.message);
    if (translated.status === 409) return new ConflictError(translated.message);
  }
  return new DataError(translated.message);
}

export async function atDataBoundary<T>(operation: () => Promise<T>): Promise<T> {
  try { return await operation(); }
  catch (error) { throw translateError(error); }
}
