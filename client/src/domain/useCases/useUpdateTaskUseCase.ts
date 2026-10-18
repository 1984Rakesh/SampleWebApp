import { useTaskRepository } from '../../data/repositories';
import type { Task } from '../models';
import type { TaskStatus, TaskPriority } from '../models';
import { updateTaskUseCase } from './UpdateTaskUseCase';

export interface UpdateTaskFormInput {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export function useUpdateTaskUseCase() {
  const { useUpdateTaskMutation } = useTaskRepository();
  const mutation = useUpdateTaskMutation();

  const mutateAsync = async (input: UpdateTaskFormInput): Promise<Task> => {
    await updateTaskUseCase(input);
    const { id, ...updates } = input;
    return mutation.mutateAsync({ id, input: updates });
  };

  return {
    mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
}
