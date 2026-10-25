import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { UnauthorizedError } from '../../../shared/domain/errors';
import type { TokenService } from '../../domain/ports';

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
