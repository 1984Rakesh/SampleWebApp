import type { Task } from '../models';
import { TaskStatus } from '../models';
import type { TaskRepository } from '../repositories';

export interface ToggleTaskStatusInput {
  id: string;
  status: TaskStatus;
}

export function nextTaskStatus(current: TaskStatus): TaskStatus {
  switch (current) {
    case TaskStatus.TODO:
      return TaskStatus.IN_PROGRESS;
    case TaskStatus.IN_PROGRESS:
      return TaskStatus.COMPLETED;
    case TaskStatus.COMPLETED:
      return TaskStatus.TODO;
  }
}

export async function toggleTaskStatusUseCase(
  repository: TaskRepository,
  input: ToggleTaskStatusInput
): Promise<Task> {
  if (!input.id || input.id.length === 0) {
    throw new Error('Task ID is required');
  }

  if (!Object.values(TaskStatus).includes(input.status)) {
    throw new Error('Invalid task status');
  }

  return repository.toggleTaskStatus(input);
}
