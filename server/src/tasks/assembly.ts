import type { DatabaseConnection } from '../foundation/database';
import type { HttpMiddleware, HttpRouter } from '../foundation/http';
import {
  CreateTaskUseCase,
  DeleteTaskUseCase,
  GetTasksUseCase,
  ToggleTaskStatusUseCase,
  UpdateTaskUseCase,
} from './domain/useCases';
import { SqliteTaskRepository } from './infrastructure/repositories';
import { createTaskController } from './presentation/controllers';
import { createTaskRoutes } from './presentation/routes';

export interface TasksFeatureDependencies {
  db: DatabaseConnection;
  authMiddleware: HttpMiddleware;
}

export interface TasksFeature {
  router: HttpRouter;
}

export function createTasksFeature({ db, authMiddleware }: TasksFeatureDependencies): TasksFeature {
  const taskRepository = new SqliteTaskRepository(db);

  const taskController = createTaskController({
    getTasks: new GetTasksUseCase(taskRepository),
    createTask: new CreateTaskUseCase(taskRepository),
    updateTask: new UpdateTaskUseCase(taskRepository),
    deleteTask: new DeleteTaskUseCase(taskRepository),
    toggleTaskStatus: new ToggleTaskStatusUseCase(taskRepository),
  });

  return { router: createTaskRoutes(taskController, authMiddleware) };
}
