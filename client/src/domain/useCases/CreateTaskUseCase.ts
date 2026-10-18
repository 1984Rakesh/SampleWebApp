import { normalizeTaskTitle, type CreateTaskInput, type Task } from '../models';
import type { TaskRepository } from '../repositories';

export type { CreateTaskInput };

export async function createTaskUseCase(
  repository: TaskRepository,
  input: CreateTaskInput
): Promise<Task> {
  const title = normalizeTaskTitle(input.title);
  return repository.createTask({ ...input, title });
}
