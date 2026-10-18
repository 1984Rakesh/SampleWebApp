import {
  DEFAULT_TASK_PRIORITY,
  DEFAULT_TASK_STATUS,
  normalizeTaskTitle,
  type Task,
  type TaskPriority,
} from '../../models/Task';
import type { TaskRepository } from '../../ports/TaskRepository';

export interface CreateTaskInput {
  userId: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
}

export class CreateTaskUseCase {
  constructor(private readonly tasks: TaskRepository) {}

  execute({ userId, title, description, priority, dueDate }: CreateTaskInput): Promise<Task> {
    return this.tasks.create(userId, {
      title: normalizeTaskTitle(title),
      description: description || null,
      status: DEFAULT_TASK_STATUS,
      priority: priority ?? DEFAULT_TASK_PRIORITY,
      dueDate: dueDate || null,
    });
  }
}
