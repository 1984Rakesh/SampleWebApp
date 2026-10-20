import { createContext, useContext } from 'react';
import type { Task, GetTasksInput, CreateTaskInput, UpdateTaskInput, DeleteTaskInput, ToggleTaskStatusInput } from '../../domain/models';

export interface TaskUseCases {
  useTasksQuery(input?: GetTasksInput): { data: Task[] | undefined; isLoading: boolean; error: Error | null };
  createTask(input: CreateTaskInput): Promise<Task>;
  updateTask(input: UpdateTaskInput): Promise<Task>;
  deleteTask(input: DeleteTaskInput): Promise<void>;
  toggleTaskStatus(input: ToggleTaskStatusInput): Promise<Task>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isToggling: boolean;
}

export const TaskUseCasesContext = createContext<TaskUseCases | undefined>(undefined);

export function useTaskUseCases(): TaskUseCases {
  const value = useContext(TaskUseCasesContext);
  if (!value) throw new Error('Task use cases must be supplied by App');
  return value;
}
