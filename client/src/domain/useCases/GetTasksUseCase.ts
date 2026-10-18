import { TaskStatus, TaskPriority, type GetTasksInput, type Task } from '../models';
import type { TaskRepository } from '../repositories';

export type { GetTasksInput };

export function validateTaskFilters(input?: GetTasksInput): GetTasksInput {
  if (input?.status && !Object.values(TaskStatus).includes(input.status)) {
    throw new Error('Invalid task status filter');
  }

  if (input?.priority && !Object.values(TaskPriority).includes(input.priority)) {
    throw new Error('Invalid task priority filter');
  }

  return { status: input?.status, priority: input?.priority };
}

export async function getTasksUseCase(
  repository: TaskRepository,
  input?: GetTasksInput
): Promise<Task[]> {
  return repository.getTasks(validateTaskFilters(input));
}
