import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { UnauthorizedError } from '../../domain/errors';
import type { TokenPayload } from '../../domain/models/Auth';
import type { TokenService } from '../../domain/ports/TokenService';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function createAuthMiddleware(tokenService: TokenService): RequestHandler {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    req.user = await tokenService.verifyAccessToken(authHeader.substring(7));
    next();
  };
}
