import {
  DEFAULT_TASK_PRIORITY,
  DEFAULT_TASK_STATUS,
  normalizeTaskTitle,
  type Task,
  type TaskPriority,
} from '../models/Task';
import type { TaskRepository } from '../ports/TaskRepository';
import { normalizeOptionalText } from '../../../shared/domain/normalizeOptionalText';

export interface CreateTaskInput {
  userId: string;
  title: string;
  description?: string | null;
  priority?: TaskPriority;
  dueDate?: string | null;
}

export class CreateTaskUseCase {
  constructor(private readonly tasks: TaskRepository) {}

  execute({ userId, title, description, priority, dueDate }: CreateTaskInput): Promise<Task> {
    return this.tasks.create(userId, {
      title: normalizeTaskTitle(title),
      description: normalizeOptionalText(description) ?? null,
      status: DEFAULT_TASK_STATUS,
      priority: priority ?? DEFAULT_TASK_PRIORITY,
      dueDate: normalizeOptionalText(dueDate) ?? null,
    });
  }
}
