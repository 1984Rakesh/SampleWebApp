import { TaskStatus, TaskPriority } from '../models';

export interface GetTasksInput {
  status?: TaskStatus;
  priority?: TaskPriority;
}

export function getTasksUseCase(input?: GetTasksInput): GetTasksInput {
  if (input?.status && !Object.values(TaskStatus).includes(input.status)) {
    throw new Error('Invalid task status filter');
  }

  if (input?.priority && !Object.values(TaskPriority).includes(input.priority)) {
    throw new Error('Invalid task priority filter');
  }

  return { status: input?.status, priority: input?.priority };
}
