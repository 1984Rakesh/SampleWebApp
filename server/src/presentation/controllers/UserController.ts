import type { Request, Response } from 'express';
import type { GetCurrentUserUseCase } from '../../domain/useCases/users/GetCurrentUserUseCase';
import type { UpdateProfileUseCase } from '../../domain/useCases/users/UpdateProfileUseCase';
import { parseRequest } from '../http/parseRequest';
import { requireUserId } from '../http/requireUserId';
import { userToResponse } from '../mappers/UserDtoMapper';
import { updateProfileBodySchema } from '../schemas/UserDto';

export interface UserControllerDependencies {
  getCurrentUser: GetCurrentUserUseCase;
  updateProfile: UpdateProfileUseCase;
}

export function createUserController(useCases: UserControllerDependencies) {
  return {
    async getCurrentUser(req: Request, res: Response): Promise<void> {
      const user = await useCases.getCurrentUser.execute(requireUserId(req));
      res.json(userToResponse(user));
    },

    async updateProfile(req: Request, res: Response): Promise<void> {
      const changes = parseRequest(updateProfileBodySchema, req.body);
      const user = await useCases.updateProfile.execute({ userId: requireUserId(req), changes });
      res.json(userToResponse(user));
    },
  };
}

export type UserController = ReturnType<typeof createUserController>;
