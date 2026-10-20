import type { Task, TaskFilters } from '../models/Task';
import type { TaskRepository } from '../ports/TaskRepository';

export interface GetTasksInput {
  userId: string;
  filters: TaskFilters;
}

export class GetTasksUseCase {
  constructor(private readonly tasks: TaskRepository) {}

  execute({ userId, filters }: GetTasksInput): Promise<Task[]> {
    return this.tasks.findAllByUser(userId, filters);
  }
}
