import type { Task } from '../models';
import type { CreateTaskInput } from '../useCases/CreateTaskUseCase';
import type { UpdateTaskInput } from '../useCases/UpdateTaskUseCase';
import type { ToggleTaskStatusInput } from '../useCases/ToggleTaskStatusUseCase';

export interface TaskRepository {
  createTask(input: CreateTaskInput): Promise<Task>;
  updateTask(input: UpdateTaskInput): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  toggleTaskStatus(input: ToggleTaskStatusInput): Promise<Task>;
}
