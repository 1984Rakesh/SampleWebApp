import { NotFoundError } from '../../errors';
import { normalizeTaskTitle, type Task, type TaskChanges } from '../../models/Task';
import type { TaskRepository } from '../../ports/TaskRepository';

export interface UpdateTaskInput {
  id: string;
  userId: string;
  changes: TaskChanges;
}

export class UpdateTaskUseCase {
  constructor(private readonly tasks: TaskRepository) {}

  async execute({ id, userId, changes }: UpdateTaskInput): Promise<Task> {
    const normalized: TaskChanges = {
      ...changes,
      title: changes.title === undefined ? undefined : normalizeTaskTitle(changes.title),
    };

    const task = await this.tasks.update(id, userId, normalized);
    if (!task) {
      throw new NotFoundError('Task not found');
    }
    return task;
  }
}
