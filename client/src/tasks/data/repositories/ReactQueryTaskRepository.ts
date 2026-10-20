import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { GetTasksInput } from '../../domain/models';
import type { TaskRepository } from '../../domain/repositories';
import { getTasksUseCase } from '../../domain/useCases';

export function useTaskRepository(source: TaskRepository) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['tasks'] });

  const createMutation = useMutation({ mutationFn: source.createTask, onSuccess: invalidate });
  const updateMutation = useMutation({ mutationFn: source.updateTask, onSuccess: invalidate });
  const deleteMutation = useMutation({ mutationFn: source.deleteTask, onSuccess: invalidate });
  const toggleStatusMutation = useMutation({ mutationFn: source.toggleTaskStatus, onSuccess: invalidate });

  const repository: TaskRepository = {
    getTasks: source.getTasks,
    createTask: (input) => createMutation.mutateAsync(input),
    updateTask: (input) => updateMutation.mutateAsync(input),
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
