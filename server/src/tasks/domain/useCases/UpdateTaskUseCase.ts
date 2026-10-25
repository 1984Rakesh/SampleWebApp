import { NotFoundError, normalizeOptionalText } from '../../../shared/domain';
import { normalizeTaskTitle, type Task, type TaskChanges } from '../models';
import type { TaskRepository } from '../ports';

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
      description: normalizeOptionalText(changes.description),
      dueDate: normalizeOptionalText(changes.dueDate),
    };

    const task = await this.tasks.update(id, userId, normalized);
    if (!task) {
      throw new NotFoundError('Task not found');
    }
    return task;
  }
}
