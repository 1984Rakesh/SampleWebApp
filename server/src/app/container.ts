import type { Router } from 'express';
import { LoginUseCase } from '../domain/useCases/auth/LoginUseCase';
import { RefreshAccessTokenUseCase } from '../domain/useCases/auth/RefreshAccessTokenUseCase';
import { RegisterUserUseCase } from '../domain/useCases/auth/RegisterUserUseCase';
import { CreateTaskUseCase } from '../domain/useCases/tasks/CreateTaskUseCase';
import { DeleteTaskUseCase } from '../domain/useCases/tasks/DeleteTaskUseCase';
import { GetTasksUseCase } from '../domain/useCases/tasks/GetTasksUseCase';
import { ToggleTaskStatusUseCase } from '../domain/useCases/tasks/ToggleTaskStatusUseCase';
import { UpdateTaskUseCase } from '../domain/useCases/tasks/UpdateTaskUseCase';
import { GetCurrentUserUseCase } from '../domain/useCases/users/GetCurrentUserUseCase';
import { UpdateProfileUseCase } from '../domain/useCases/users/UpdateProfileUseCase';
import { createDatabase, type DatabaseConnection } from '../infrastructure/database/connection';
import { SqliteTaskRepository } from '../infrastructure/repositories/SqliteTaskRepository';
import { SqliteUserRepository } from '../infrastructure/repositories/SqliteUserRepository';
import { BcryptPasswordHasher } from '../infrastructure/security/BcryptPasswordHasher';
import { JwtTokenService } from '../infrastructure/security/JwtTokenService';
import { createAuthController } from '../presentation/controllers/AuthController';
import { createTaskController } from '../presentation/controllers/TaskController';
import { createUserController } from '../presentation/controllers/UserController';
import { createAuthMiddleware } from '../presentation/middleware/authMiddleware';
import { createAuthRoutes } from '../presentation/routes/authRoutes';
import { createTaskRoutes } from '../presentation/routes/taskRoutes';
import { createUserRoutes } from '../presentation/routes/userRoutes';
import type { AppConfig } from './config';

export interface Container {
  db: DatabaseConnection;
  routers: {
    auth: Router;
    users: Router;
    tasks: Router;
  };
}

export function createContainer(config: AppConfig): Container {
  const db = createDatabase(config.dbPath);

  const taskRepository = new SqliteTaskRepository(db);
  const userRepository = new SqliteUserRepository(db);
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService(config.jwt);

  const authMiddleware = createAuthMiddleware(tokenService);

  const authController = createAuthController({
    registerUser: new RegisterUserUseCase(userRepository, passwordHasher, tokenService),
    login: new LoginUseCase(userRepository, passwordHasher, tokenService),
    refreshAccessToken: new RefreshAccessTokenUseCase(tokenService, userRepository),
  });

  const userController = createUserController({
    getCurrentUser: new GetCurrentUserUseCase(userRepository),
    updateProfile: new UpdateProfileUseCase(userRepository),
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
    routers: {
      auth: createAuthRoutes(authController),
      users: createUserRoutes(userController, authMiddleware),
      tasks: createTaskRoutes(taskController, authMiddleware),
    },
  };
}
