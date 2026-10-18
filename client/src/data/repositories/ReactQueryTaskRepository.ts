import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../api';
import type { CreateTaskDTO, UpdateTaskDTO } from '../dtos';
import { taskToDomain, toCreateTaskDTO, toUpdateTaskDTO } from '../mappers';
import type { GetTasksInput, ToggleTaskStatusInput } from '../../domain/models';
import type { TaskRepository } from '../../domain/repositories';
import { getTasksUseCase } from '../../domain/useCases';

export function useTaskRepository() {
  const queryClient = useQueryClient();

  const getTasks = async (input?: GetTasksInput) => {
    const dtos = await taskApi.getTasks(input);
    return dtos.map(taskToDomain);
  };

  const createMutation = useMutation({
    mutationFn: async (input: CreateTaskDTO) => {
      const response = await taskApi.createTask(input);
      return taskToDomain(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateTaskDTO }) => {
      const response = await taskApi.updateTask(id, input);
      return taskToDomain(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await taskApi.deleteTask(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: ToggleTaskStatusInput) => {
      const response = await taskApi.toggleTaskStatus(id, status);
      return taskToDomain(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const repository: TaskRepository = {
    getTasks,
    createTask: (input) => createMutation.mutateAsync(toCreateTaskDTO(input)),
    updateTask: ({ id, ...updates }) =>
      updateMutation.mutateAsync({ id, input: toUpdateTaskDTO(updates) }),
    deleteTask: (id) => deleteMutation.mutateAsync(id),
    toggleTaskStatus: (input) => toggleStatusMutation.mutateAsync(input),
  };

  const useTasksQuery = (input?: GetTasksInput) =>
    useQuery({
      queryKey: ['tasks', input?.status, input?.priority],
      queryFn: () => getTasksUseCase(repository, input),
    });

  return {
    repository,
    useTasksQuery,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isToggling: toggleStatusMutation.isPending,
  };
}
