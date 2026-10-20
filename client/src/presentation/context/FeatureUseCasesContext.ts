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
export interface FeatureUseCases {
  tasks: TaskUseCases;
  useProfileSummary(): { name: string; isLoading: boolean };
}
export const FeatureUseCasesContext = createContext<FeatureUseCases | undefined>(undefined);
function useFeatureUseCases(): FeatureUseCases {
  const value = useContext(FeatureUseCasesContext);
  if (!value) throw new Error('Feature use cases must be supplied by App');
  return value;
}
export function useTaskUseCases(): TaskUseCases { return useFeatureUseCases().tasks; }
export function useDashboardProfile() { return useFeatureUseCases().useProfileSummary(); }
