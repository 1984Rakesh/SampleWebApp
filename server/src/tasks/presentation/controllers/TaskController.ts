import type { Request, Response } from 'express';
import type {
  CreateTaskUseCase,
  DeleteTaskUseCase,
  GetTasksUseCase,
  ToggleTaskStatusUseCase,
  UpdateTaskUseCase,
} from '../../domain/useCases';
import { parseRequest, requireUserId } from '../../../foundation/http';
import { taskToResponse } from '../mappers';
import {
  createTaskBodySchema,
  listTasksQuerySchema,
  taskIdParamsSchema,
  updateTaskBodySchema,
  updateTaskStatusBodySchema,
} from '../schemas';

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
