import type { Task } from '../models';
import { TaskStatus, TaskPriority } from '../models';

export interface GetTasksInput {
  status?: TaskStatus;
  priority?: TaskPriority;
}

export async function getTasksUseCase(
  _input?: GetTasksInput
): Promise<Task[]> {
  // This would normally call the repository/API
  throw new Error('Repository not implemented');
}
