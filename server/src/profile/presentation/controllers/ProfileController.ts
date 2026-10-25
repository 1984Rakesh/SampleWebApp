import type { Request, Response } from 'express';
import type { GetCurrentUserUseCase, UpdateProfileUseCase } from '../../domain/useCases';
import { parseRequest, requireUserId } from '../../../foundation/http';
import { profileToResponse } from '../mappers';
import { updateProfileBodySchema } from '../schemas';

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
