import type { Task, TaskPriority } from '../models';
import type { TaskRepository } from '../repositories';

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
  userId: string;
}

export async function createTaskUseCase(
  repository: TaskRepository,
  input: CreateTaskInput
): Promise<Task> {
  if (!input.title || input.title.trim().length === 0) {
    throw new Error('Title is required');
  }

  if (!input.userId || input.userId.length === 0) {
    throw new Error('User ID is required');
  }

  return repository.createTask(input);
}
