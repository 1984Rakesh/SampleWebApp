import { useTaskRepository } from '../../data/repositories';
import {
  createTaskUseCase,
  updateTaskUseCase,
  deleteTaskUseCase,
  toggleTaskStatusUseCase,
  type CreateTaskInput,
  type UpdateTaskInput,
  type DeleteTaskInput,
  type ToggleTaskStatusInput,
} from '../../domain/useCases';

export function useTaskUseCases() {
  const { repository, useTasksQuery, isCreating, isUpdating, isDeleting, isToggling } =
    useTaskRepository();

  return {
    useTasksQuery,
    createTask: (input: CreateTaskInput) => createTaskUseCase(repository, input),
    updateTask: (input: UpdateTaskInput) => updateTaskUseCase(repository, input),
    deleteTask: (input: DeleteTaskInput) => deleteTaskUseCase(repository, input),
    toggleTaskStatus: (input: ToggleTaskStatusInput) => toggleTaskStatusUseCase(repository, input),
    isCreating,
    isUpdating,
    isDeleting,
    isToggling,
  };
}
