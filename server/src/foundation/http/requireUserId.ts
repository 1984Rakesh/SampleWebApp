import type { Request } from 'express';
import { UnauthorizedError } from '../../shared/domain';

export interface AuthenticatedIdentity {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedIdentity;
    }
  }
}

export function requireUserId(req: Request): string {
  const userId = req.user?.userId;
  if (!userId) {
    throw new UnauthorizedError('Unauthorized');
  }
  return userId;
}
