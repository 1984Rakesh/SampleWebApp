import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../api';
import { taskToDomain } from '../mappers';
import type { CreateTaskInput, UpdateTaskInput } from '../api';
import type { TaskStatus } from '../../domain/models';
import type { GetTasksInput } from '../../domain/useCases';

export function useTaskRepository() {
  const queryClient = useQueryClient();

  const useGetTasksQuery = (input?: GetTasksInput) =>
    useQuery({
      queryKey: ['tasks', input?.status, input?.priority],
      queryFn: async () => {
        const dtos = await taskApi.getTasks(input);
        return dtos.map(taskToDomain);
      },
    });

  const useCreateTaskMutation = () =>
    useMutation({
      mutationFn: async (input: CreateTaskInput) => {
        const response = await taskApi.createTask(input);
        return taskToDomain(response);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      },
    });

  const useUpdateTaskMutation = () =>
    useMutation({
      mutationFn: async ({ id, input }: { id: string; input: UpdateTaskInput }) => {
        const response = await taskApi.updateTask(id, input);
        return taskToDomain(response);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      },
    });

  const useDeleteTaskMutation = () =>
    useMutation({
      mutationFn: async (id: string) => {
        await taskApi.deleteTask(id);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      },
    });

  const useToggleTaskStatusMutation = () =>
    useMutation({
      mutationFn: async ({ id, status }: { id: string; status: TaskStatus }) => {
        const response = await taskApi.toggleTaskStatus(id, status);
        return taskToDomain(response);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      },
    });

  return {
    useGetTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useToggleTaskStatusMutation,
  };
}
