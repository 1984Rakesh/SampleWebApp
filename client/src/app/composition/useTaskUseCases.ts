import { axiosClient } from '../../foundation/network';
import { createTaskApi } from '../../tasks/data/api';
import { createTaskRepository, useTaskRepository } from '../../tasks/data/repositories';
import {
  createTaskUseCase,
  updateTaskUseCase,
  deleteTaskUseCase,
  toggleTaskStatusUseCase,
  type CreateTaskInput,
  type UpdateTaskInput,
  type DeleteTaskInput,
  type ToggleTaskStatusInput,
} from '../../tasks/domain/useCases';

const taskRepository = createTaskRepository(createTaskApi(axiosClient));

export function useTaskUseCases() {
  const { repository, useTasksQuery, isCreating, isUpdating, isDeleting, isToggling } =
    useTaskRepository(taskRepository);

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
