import type { Request, Response } from 'express';
import type { GetCurrentUserUseCase } from '../../domain/useCases/GetCurrentUserUseCase';
import type { UpdateProfileUseCase } from '../../domain/useCases/UpdateProfileUseCase';
import { parseRequest } from '../../../foundation/http/parseRequest';
import { requireUserId } from '../../../foundation/http/requireUserId';
import { profileToResponse } from '../mappers/ProfileDtoMapper';
import { updateProfileBodySchema } from '../schemas/ProfileDto';

export interface ProfileControllerDependencies {
  getCurrentUser: GetCurrentUserUseCase;
  updateProfile: UpdateProfileUseCase;
}

export function createProfileController(useCases: ProfileControllerDependencies) {
  return {
    async getCurrentUser(req: Request, res: Response): Promise<void> {
      const profile = await useCases.getCurrentUser.execute(requireUserId(req));
      res.json(profileToResponse(profile));
    },

    async updateProfile(req: Request, res: Response): Promise<void> {
      const changes = parseRequest(updateProfileBodySchema, req.body);
      const profile = await useCases.updateProfile.execute({ userId: requireUserId(req), changes });
      res.json(profileToResponse(profile));
    },
  };
}

export type ProfileController = ReturnType<typeof createProfileController>;
