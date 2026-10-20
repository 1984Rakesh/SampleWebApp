import { NotFoundError } from '../../../shared/domain/errors';
import type { TaskRepository } from '../ports/TaskRepository';

export interface DeleteTaskInput {
  id: string;
  userId: string;
}

export class DeleteTaskUseCase {
  constructor(private readonly tasks: TaskRepository) {}

  async execute({ id, userId }: DeleteTaskInput): Promise<void> {
    const deleted = await this.tasks.delete(id, userId);
    if (!deleted) {
      throw new NotFoundError('Task not found');
    }
  }
}
