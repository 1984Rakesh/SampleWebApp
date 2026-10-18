import { NotFoundError } from '../../errors';
import type { Task, TaskStatus } from '../../models/Task';
import type { TaskRepository } from '../../ports/TaskRepository';

export interface ToggleTaskStatusInput {
  id: string;
  userId: string;
  status: TaskStatus;
}

export class ToggleTaskStatusUseCase {
  constructor(private readonly tasks: TaskRepository) {}

  async execute({ id, userId, status }: ToggleTaskStatusInput): Promise<Task> {
    const task = await this.tasks.update(id, userId, { status });
    if (!task) {
      throw new NotFoundError('Task not found');
    }
    return task;
  }
}
