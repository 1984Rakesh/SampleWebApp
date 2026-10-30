import type { DatabaseConnection } from '../foundation/database';
import type { HttpMiddleware, HttpRouter } from '../foundation/http';
import { GetCurrentUserUseCase, UpdateProfileUseCase } from './domain/useCases';
import { SqliteProfileRepository } from './infrastructure/repositories';
import { createProfileController } from './presentation/controllers';
import { createProfileRoutes } from './presentation/routes';

export interface ProfileFeatureDependencies {
  db: DatabaseConnection;
  authMiddleware: HttpMiddleware;
}

export interface ProfileFeature {
  router: HttpRouter;
}

export function createProfileFeature({ db, authMiddleware }: ProfileFeatureDependencies): ProfileFeature {
  const profileRepository = new SqliteProfileRepository(db);

  const profileController = createProfileController({
    getCurrentUser: new GetCurrentUserUseCase(profileRepository),
    updateProfile: new UpdateProfileUseCase(profileRepository),
  });

  return { router: createProfileRoutes(profileController, authMiddleware) };
}
