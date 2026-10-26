import { useAuth } from '../../security/presentation/context';
import { nextTaskStatus } from '../../tasks/domain/useCases';
import { TASK_STATUS_LABELS, toTaskCounts, toTaskItemViewState } from '../../tasks/presentation/models';
import type { DashboardCapabilities } from '../../dashboard/presentation/context';
import { useTaskUseCases } from './useTaskUseCases';
import { useUserUseCases } from './useUserUseCases';

const statusLabels: DashboardCapabilities['statusLabels'] = {
  completed: TASK_STATUS_LABELS.COMPLETED,
  inProgress: TASK_STATUS_LABELS.IN_PROGRESS,
  todo: TASK_STATUS_LABELS.TODO,
};

export function useDashboardCapabilities(): DashboardCapabilities {
  const { user } = useAuth();
  const taskUseCases = useTaskUseCases();
  const profile = useUserUseCases();
  const profileQuery = profile.useCurrentUserQuery();
  const tasksQuery = taskUseCases.useTasksQuery({});
  const tasks = tasksQuery.data ?? [];

  const toggleTaskStatus = async (id: string) => {
    const task = tasks.find((candidate) => candidate.id === id);
    if (!task) return;
    try {
      await taskUseCases.toggleTaskStatus({ id, status: nextTaskStatus(task.status) });
    } catch {
      // Dashboard does not surface toggle errors (unchanged behavior).
    }
  };

  return {
    profileName: profileQuery.data?.name || user?.name || 'User',
    isProfileLoading: profileQuery.isLoading,
    taskItems: tasks.map(toTaskItemViewState),
    counts: toTaskCounts(tasks),
    statusLabels,
    isTasksLoading: tasksQuery.isLoading,
    errorMessage: tasksQuery.error instanceof Error ? tasksQuery.error.message : undefined,
    toggleTaskStatus,
  };
}
