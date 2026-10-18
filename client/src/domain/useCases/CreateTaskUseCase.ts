import type { TaskPriority } from '../models';

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
  userId: string;
}

export async function createTaskUseCase(
  input: CreateTaskInput
): Promise<CreateTaskInput> {
  if (!input.title || input.title.trim().length === 0) {
    throw new Error('Title is required');
  }

  if (!input.userId || input.userId.length === 0) {
    throw new Error('User ID is required');
  }

  return input;
}
