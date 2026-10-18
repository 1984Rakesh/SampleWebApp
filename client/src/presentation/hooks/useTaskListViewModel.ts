import { useTaskRepository } from '../../data/repositories';
import type { TaskStatus } from '../../domain/models';
import type { GetTasksInput } from '../../domain/useCases';
import type { Task } from '../../domain/models';

export function useTaskListViewModel() {
  const { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation, useToggleTaskStatusMutation } = useTaskRepository();

  const tasksQuery = useGetTasksQuery();
  const createMutation = useCreateTaskMutation();
  const updateMutation = useUpdateTaskMutation();
  const deleteMutation = useDeleteTaskMutation();
  const toggleStatusMutation = useToggleTaskStatusMutation();

  const getTasks = (_input?: GetTasksInput) => {
    tasksQuery.refetch();
  };

  const createTask = async (input: { title: string; description?: string; priority?: string; dueDate?: string }) => {
    try {
      const result = await createMutation.mutateAsync(input);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const updateTask = async (id: string, input: { title?: string; description?: string; priority?: string; dueDate?: string; status?: TaskStatus }) => {
    try {
      const result = await updateMutation.mutateAsync({ id, input });
      return result;
    } catch (error) {
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      throw error;
    }
  };

  const toggleTaskStatus = async (id: string, status: TaskStatus) => {
    try {
      await toggleStatusMutation.mutateAsync({ id, status });
    } catch (error) {
      throw error;
    }
  };

  return {
    tasks: tasksQuery.data as Task[] | undefined,
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error,
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isToggling: toggleStatusMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    toggleError: toggleStatusMutation.error,
  };
}
