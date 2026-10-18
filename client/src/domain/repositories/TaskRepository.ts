import type {
  Task,
  GetTasksInput,
  CreateTaskInput,
  UpdateTaskInput,
  ToggleTaskStatusInput,
} from '../models';

export interface TaskRepository {
  getTasks(input?: GetTasksInput): Promise<Task[]>;
  createTask(input: CreateTaskInput): Promise<Task>;
  updateTask(input: UpdateTaskInput): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  toggleTaskStatus(input: ToggleTaskStatusInput): Promise<Task>;
}
