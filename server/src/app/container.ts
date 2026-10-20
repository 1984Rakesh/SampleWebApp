import type { Router } from 'express';
import { LoginUseCase } from '../security/domain/useCases/LoginUseCase';
import { RefreshAccessTokenUseCase } from '../security/domain/useCases/RefreshAccessTokenUseCase';
import { RegisterUserUseCase } from '../security/domain/useCases/RegisterUserUseCase';
import { CreateTaskUseCase } from '../tasks/domain/useCases/CreateTaskUseCase';
import { DeleteTaskUseCase } from '../tasks/domain/useCases/DeleteTaskUseCase';
import { GetTasksUseCase } from '../tasks/domain/useCases/GetTasksUseCase';
import { ToggleTaskStatusUseCase } from '../tasks/domain/useCases/ToggleTaskStatusUseCase';
import { UpdateTaskUseCase } from '../tasks/domain/useCases/UpdateTaskUseCase';
import { GetCurrentUserUseCase } from '../profile/domain/useCases/GetCurrentUserUseCase';
import { UpdateProfileUseCase } from '../profile/domain/useCases/UpdateProfileUseCase';
import { createDatabase, type DatabaseConnection } from '../foundation/database/connection';
import { seedDatabase } from '../foundation/database/seed';
import { SqliteTaskRepository } from '../tasks/infrastructure/repositories/SqliteTaskRepository';
import { SqliteAccountRepository } from '../security/infrastructure/repositories/SqliteAccountRepository';
import { SqliteProfileRepository } from '../profile/infrastructure/repositories/SqliteProfileRepository';
import { BcryptPasswordHasher } from '../security/infrastructure/security/BcryptPasswordHasher';
import { JwtTokenService } from '../security/infrastructure/security/JwtTokenService';
import { createAuthController } from '../security/presentation/controllers/AuthController';
import { createTaskController } from '../tasks/presentation/controllers/TaskController';
import { createProfileController } from '../profile/presentation/controllers/ProfileController';
import { createAuthMiddleware } from '../security/presentation/middleware/authMiddleware';
import { createAuthRoutes } from '../security/presentation/routes/authRoutes';
import { createTaskRoutes } from '../tasks/presentation/routes/taskRoutes';
import { createProfileRoutes } from '../profile/presentation/routes/profileRoutes';
import type { AppConfig } from './config';

export interface Container {
  db: DatabaseConnection;
  seed: () => Promise<void>;
  routers: {
    auth: Router;
    users: Router;
    tasks: Router;
  };
}

export function createContainer(config: AppConfig): Container {
  const db = createDatabase(config.dbPath);

  const taskRepository = new SqliteTaskRepository(db);
  const accountRepository = new SqliteAccountRepository(db);
  const profileRepository = new SqliteProfileRepository(db);
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService(config.jwt);

  const authMiddleware = createAuthMiddleware(tokenService);

  const authController = createAuthController({
    registerUser: new RegisterUserUseCase(accountRepository, passwordHasher, tokenService),
    login: new LoginUseCase(accountRepository, passwordHasher, tokenService),
    refreshAccessToken: new RefreshAccessTokenUseCase(tokenService, accountRepository),
  });

  const profileController = createProfileController({
    getCurrentUser: new GetCurrentUserUseCase(profileRepository),
    updateProfile: new UpdateProfileUseCase(profileRepository),
  });

  const taskController = createTaskController({
    getTasks: new GetTasksUseCase(taskRepository),
    createTask: new CreateTaskUseCase(taskRepository),
    updateTask: new UpdateTaskUseCase(taskRepository),
    deleteTask: new DeleteTaskUseCase(taskRepository),
    toggleTaskStatus: new ToggleTaskStatusUseCase(taskRepository),
  });

  return {
    db,
    seed: () => seedDatabase(db, (password) => passwordHasher.hash(password)),
    routers: {
      auth: createAuthRoutes(authController),
      users: createProfileRoutes(profileController, authMiddleware),
      tasks: createTaskRoutes(taskController, authMiddleware),
    },
  };
}
