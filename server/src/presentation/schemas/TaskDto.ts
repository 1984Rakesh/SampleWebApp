import { z } from 'zod';
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskPriority,
  type TaskStatus,
} from '../../domain/models/Task';

const statusSchema = z.enum(TASK_STATUSES, { error: 'Invalid status' });
const prioritySchema = z.enum(TASK_PRIORITIES, { error: 'Invalid priority' });
const optionalText = z
  .string({ error: 'Expected a string' })
  .nullish()
  .transform((value) => value ?? undefined);
const clearableText = z.string({ error: 'Expected a string' }).nullish();

export const taskIdParamsSchema = z.object({
  id: z.string().min(1, { error: 'Task id is required' }),
});

export const listTasksQuerySchema = z.object({
  status: statusSchema.optional(),
  priority: prioritySchema.optional(),
});

export const createTaskBodySchema = z.object({
  title: z.string({ error: 'Title is required' }),
  description: clearableText,
  priority: prioritySchema.nullish().transform((value) => value ?? undefined),
  dueDate: clearableText,
});

export const updateTaskBodySchema = z.object({
  title: optionalText,
  description: clearableText,
  status: statusSchema.nullish().transform((value) => value ?? undefined),
  priority: prioritySchema.nullish().transform((value) => value ?? undefined),
  dueDate: clearableText,
});

export const updateTaskStatusBodySchema = z.object({
  status: statusSchema,
});

export interface TaskResponse {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
