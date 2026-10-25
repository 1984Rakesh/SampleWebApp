import type { NewTask, Task, TaskChanges, TaskFilters } from '../models';

export interface TaskRepository {
  findAllByUser(userId: string, filters: TaskFilters): Promise<Task[]>;
  create(userId: string, task: NewTask): Promise<Task>;
  update(id: string, userId: string, changes: TaskChanges): Promise<Task | null>;
  delete(id: string, userId: string): Promise<boolean>;
}
