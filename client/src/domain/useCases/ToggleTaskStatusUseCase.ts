import type { Task } from '../models';
import { TaskStatus } from '../models';

export interface ToggleTaskStatusInput {
  id: string;
  status: TaskStatus;
}

export async function toggleTaskStatusUseCase(
  input: ToggleTaskStatusInput
): Promise<Task> {
  if (!input.id || input.id.length === 0) {
    throw new Error('Task ID is required');
  }

  if (!Object.values(TaskStatus).includes(input.status)) {
    throw new Error('Invalid task status');
  }

  // This would normally call the repository/API
  throw new Error('Repository not implemented');
}
