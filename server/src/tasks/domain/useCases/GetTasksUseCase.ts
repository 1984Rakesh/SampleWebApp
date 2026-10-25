import type { Task, TaskFilters } from '../models';
import type { TaskRepository } from '../ports';

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
