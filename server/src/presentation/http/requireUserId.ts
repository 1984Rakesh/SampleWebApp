import type { Request } from 'express';
import { UnauthorizedError } from '../../domain/errors';

export function requireUserId(req: Request): string {
  const userId = req.user?.userId;
  if (!userId) {
    throw new UnauthorizedError('Unauthorized');
  }
  return userId;
}
