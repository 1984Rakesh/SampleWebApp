import { normalizeTaskTitle, type Task, type UpdateTaskInput } from '../models';
import type { TaskRepository } from '../repositories';

export type { UpdateTaskInput };

export async function updateTaskUseCase(
  repository: TaskRepository,
  input: UpdateTaskInput
): Promise<Task> {
  if (!input.id || input.id.trim().length === 0) {
    throw new Error('Task ID is required');
  }

  const title = input.title !== undefined ? normalizeTaskTitle(input.title) : undefined;
  return repository.updateTask({ ...input, title });
}
