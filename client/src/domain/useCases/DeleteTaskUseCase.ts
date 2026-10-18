import type { TaskRepository } from '../repositories';

export interface DeleteTaskInput {
  id: string;
}

export async function deleteTaskUseCase(
  repository: TaskRepository,
  input: DeleteTaskInput
): Promise<void> {
  if (!input.id || input.id.length === 0) {
    throw new Error('Task ID is required');
  }

  return repository.deleteTask(input.id);
}
