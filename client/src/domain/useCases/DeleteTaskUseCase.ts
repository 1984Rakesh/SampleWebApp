import type { DeleteTaskInput } from '../models';
import type { TaskRepository } from '../repositories';

export type { DeleteTaskInput };

export async function deleteTaskUseCase(
  repository: TaskRepository,
  input: DeleteTaskInput
): Promise<void> {
  if (!input.id || input.id.trim().length === 0) {
    throw new Error('Task ID is required');
  }

  return repository.deleteTask(input.id);
}
