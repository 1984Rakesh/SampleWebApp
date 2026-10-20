import type { Request, Response } from 'express';
import type { CreateTaskUseCase } from '../../domain/useCases/CreateTaskUseCase';
import type { DeleteTaskUseCase } from '../../domain/useCases/DeleteTaskUseCase';
import type { GetTasksUseCase } from '../../domain/useCases/GetTasksUseCase';
import type { ToggleTaskStatusUseCase } from '../../domain/useCases/ToggleTaskStatusUseCase';
import type { UpdateTaskUseCase } from '../../domain/useCases/UpdateTaskUseCase';
import { parseRequest } from '../../../foundation/http/parseRequest';
import { requireUserId } from '../../../foundation/http/requireUserId';
import { taskToResponse } from '../mappers/TaskDtoMapper';
import {
  createTaskBodySchema,
  listTasksQuerySchema,
  taskIdParamsSchema,
  updateTaskBodySchema,
  updateTaskStatusBodySchema,
} from '../schemas/TaskDto';

export interface TaskControllerDependencies {
  getTasks: GetTasksUseCase;
  createTask: CreateTaskUseCase;
  updateTask: UpdateTaskUseCase;
  deleteTask: DeleteTaskUseCase;
  toggleTaskStatus: ToggleTaskStatusUseCase;
}

export function createTaskController(useCases: TaskControllerDependencies) {
  return {
    async getTasks(req: Request, res: Response): Promise<void> {
      const filters = parseRequest(listTasksQuerySchema, req.query);
      const tasks = await useCases.getTasks.execute({ userId: requireUserId(req), filters });
      res.json(tasks.map(taskToResponse));
    },

    async createTask(req: Request, res: Response): Promise<void> {
      const body = parseRequest(createTaskBodySchema, req.body);
      const task = await useCases.createTask.execute({ ...body, userId: requireUserId(req) });
      res.status(201).json(taskToResponse(task));
    },

    async updateTask(req: Request, res: Response): Promise<void> {
      const { id } = parseRequest(taskIdParamsSchema, req.params);
      const changes = parseRequest(updateTaskBodySchema, req.body);
      const task = await useCases.updateTask.execute({ id, userId: requireUserId(req), changes });
      res.json(taskToResponse(task));
    },

    async deleteTask(req: Request, res: Response): Promise<void> {
      const { id } = parseRequest(taskIdParamsSchema, req.params);
      await useCases.deleteTask.execute({ id, userId: requireUserId(req) });
      res.status(204).send();
    },

    async toggleStatus(req: Request, res: Response): Promise<void> {
      const { id } = parseRequest(taskIdParamsSchema, req.params);
      const { status } = parseRequest(updateTaskStatusBodySchema, req.body);
      const task = await useCases.toggleTaskStatus.execute({ id, userId: requireUserId(req), status });
      res.json(taskToResponse(task));
    },
  };
}

export type TaskController = ReturnType<typeof createTaskController>;
