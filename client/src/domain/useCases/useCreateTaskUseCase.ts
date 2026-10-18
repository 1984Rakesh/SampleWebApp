import { useTaskRepository } from '../../data/repositories';
import type { Task } from '../models';
import type { TaskPriority } from '../models';
import { createTaskUseCase } from './CreateTaskUseCase';

export interface CreateTaskFormInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
}

export function useCreateTaskUseCase(userId: string) {
  const { useCreateTaskMutation } = useTaskRepository();
  const mutation = useCreateTaskMutation();

  const mutateAsync = async (input: CreateTaskFormInput): Promise<Task> => {
    await createTaskUseCase({ ...input, userId });
    return mutation.mutateAsync(input);
  };

  return {
    mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
}
