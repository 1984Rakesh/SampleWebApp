import type { DatabaseConnection } from '../foundation/database';
import type { HttpMiddleware, HttpRouter } from '../foundation/http';
import { LoginUseCase, RefreshAccessTokenUseCase, RegisterUserUseCase } from './domain/useCases';
import { SqliteAccountRepository } from './infrastructure/repositories';
import { BcryptPasswordHasher, JwtTokenService } from './infrastructure/security';
import { createAuthController } from './presentation/controllers';
import { createAuthMiddleware } from './presentation/middleware';
import { createAuthRoutes } from './presentation/routes';

export interface SecurityFeatureDependencies {
  db: DatabaseConnection;
  jwt: {
    secret: string;
    accessExpiresIn: string;
    refreshExpiresIn: string;
  };
}

export interface SecurityFeature {
  router: HttpRouter;
  /** Verifies the access token and sets the request identity; App injects it into other features. */
  authMiddleware: HttpMiddleware;
  /** Hashing callback App hands to the database seed. */
  hashPassword: (password: string) => Promise<string>;
}

export function createSecurityFeature({ db, jwt }: SecurityFeatureDependencies): SecurityFeature {
  const accountRepository = new SqliteAccountRepository(db);
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService(jwt);

  const authController = createAuthController({
    registerUser: new RegisterUserUseCase(accountRepository, passwordHasher, tokenService),
    login: new LoginUseCase(accountRepository, passwordHasher, tokenService),
    refreshAccessToken: new RefreshAccessTokenUseCase(tokenService, accountRepository),
  });

  return {
    router: createAuthRoutes(authController),
    authMiddleware: createAuthMiddleware(tokenService),
    hashPassword: (password) => passwordHasher.hash(password),
  };
}
