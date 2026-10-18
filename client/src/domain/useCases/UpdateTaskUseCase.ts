import type { Task } from '../models';
import type { TaskStatus, TaskPriority } from '../models';

export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export async function updateTaskUseCase(
  input: UpdateTaskInput
): Promise<Task> {
  if (!input.id || input.id.length === 0) {
    throw new Error('Task ID is required');
  }

  // This would normally call the repository/API
  throw new Error('Repository not implemented');
}
