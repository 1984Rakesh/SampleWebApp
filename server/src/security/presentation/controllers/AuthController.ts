import type { Request, Response } from 'express';
import type { LoginUseCase, RefreshAccessTokenUseCase, RegisterUserUseCase } from '../../domain/useCases';
import { parseRequest } from '../../../foundation/http/parseRequest';
import { authResultToResponse } from '../mappers';
import {
  loginBodySchema,
  refreshBodySchema,
  registerBodySchema,
  type RefreshResponse,
} from '../schemas';

export interface AuthControllerDependencies {
  registerUser: RegisterUserUseCase;
  login: LoginUseCase;
  refreshAccessToken: RefreshAccessTokenUseCase;
}

export function createAuthController(useCases: AuthControllerDependencies) {
  return {
    async register(req: Request, res: Response): Promise<void> {
      const input = parseRequest(registerBodySchema, req.body);
      const result = await useCases.registerUser.execute(input);
      res.status(201).json(authResultToResponse(result));
    },

    async login(req: Request, res: Response): Promise<void> {
      const input = parseRequest(loginBodySchema, req.body);
      const result = await useCases.login.execute(input);
      res.json(authResultToResponse(result));
    },

    async refresh(req: Request, res: Response): Promise<void> {
      const { refreshToken } = parseRequest(refreshBodySchema, req.body);
      const accessToken = await useCases.refreshAccessToken.execute(refreshToken);
      const response: RefreshResponse = { accessToken };
      res.json(response);
    },
  };
}

export type AuthController = ReturnType<typeof createAuthController>;
