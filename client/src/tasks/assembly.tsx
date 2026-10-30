import { lazy, type ReactNode } from 'react';
import type { AxiosInstance } from 'axios';
import { createTaskApi } from './data/api';
import { createTaskRepository, useTaskRepository } from './data/repositories';
import {
  createTaskUseCase,
  deleteTaskUseCase,
  nextTaskStatus,
  toggleTaskStatusUseCase,
  updateTaskUseCase,
} from './domain/useCases';
import { TaskDialog } from './presentation/components';
import { TaskUseCasesContext, type TaskUseCases } from './presentation/context';
import { TASK_STATUS_LABELS, toTaskCounts, toTaskItemViewState } from './presentation/models';
import { TasksRoute, type CreateTaskDialogProps, type TaskOverview, type TasksFeature } from './presentation/contracts';

export interface TasksFeatureDependencies {
  http: AxiosInstance;
}

/** Builds the tasks feature's internals from App-supplied cross-feature dependencies (shared §10). */
export function createTasksFeature({ http }: TasksFeatureDependencies): TasksFeature {
  const TaskListScreen = lazy(() => import('./presentation/screens').then((m) => ({ default: m.TaskListScreen })));

  const taskRepository = createTaskRepository(createTaskApi(http));

  function useTaskUseCases(): TaskUseCases {
    const { repository, useTasksQuery, isCreating, isUpdating, isDeleting, isToggling } =
      useTaskRepository(taskRepository);

    return {
      useTasksQuery,
      createTask: (input) => createTaskUseCase(repository, input),
      updateTask: (input) => updateTaskUseCase(repository, input),
      deleteTask: (input) => deleteTaskUseCase(repository, input),
      toggleTaskStatus: (input) => toggleTaskStatusUseCase(repository, input),
      isCreating,
      isUpdating,
      isDeleting,
      isToggling,
    };
  }

  function TasksProvider({ children }: { children: ReactNode }) {
    return <TaskUseCasesContext.Provider value={useTaskUseCases()}>{children}</TaskUseCasesContext.Provider>;
  }

  function CreateTaskDialog({ open, onClose }: CreateTaskDialogProps) {
    return <TaskDialog open={open} onClose={onClose} />;
  }

  function useTaskOverview(): TaskOverview {
    const useCases = useTaskUseCases();
    const query = useCases.useTasksQuery({});
    const tasks = query.data ?? [];
    return {
      items: tasks.map(toTaskItemViewState),
      counts: toTaskCounts(tasks),
      isLoading: query.isLoading,
      errorMessage: query.error instanceof Error ? query.error.message : undefined,
      toggleStatus: async (id) => {
        const task = tasks.find((candidate) => candidate.id === id);
        if (!task) return;
        await useCases.toggleTaskStatus({ id, status: nextTaskStatus(task.status) });
      },
    };
  }

  return {
    routes: [{ path: TasksRoute.list, element: <TaskListScreen /> }],
    Provider: TasksProvider,
    CreateTaskDialog,
    statusLabels: {
      completed: TASK_STATUS_LABELS.COMPLETED,
      inProgress: TASK_STATUS_LABELS.IN_PROGRESS,
      todo: TASK_STATUS_LABELS.TODO,
    },
    useTaskOverview,
  };
}
