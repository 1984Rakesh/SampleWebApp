import type { Task, TaskStatus, TaskPriority } from '../models';
import type { TaskRepository } from '../repositories';

export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export async function updateTaskUseCase(
  repository: TaskRepository,
  input: UpdateTaskInput
): Promise<Task> {
  if (!input.id || input.id.length === 0) {
    throw new Error('Task ID is required');
  }

  return repository.updateTask(input);
}
