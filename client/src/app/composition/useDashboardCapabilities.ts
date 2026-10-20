import { useAuth } from '../../security/presentation/context/AuthSessionContext';
import { nextTaskStatus } from '../../tasks/domain/useCases';
import { toTaskCounts, toTaskItemViewState } from '../../tasks/presentation/models/taskPresentation';
import type { DashboardCapabilities } from '../../dashboard/presentation/context/DashboardCapabilitiesContext';
import { useTaskUseCases } from './useTaskUseCases';
import { useUserUseCases } from './useUserUseCases';

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
    isTasksLoading: tasksQuery.isLoading,
    errorMessage: tasksQuery.error instanceof Error ? tasksQuery.error.message : undefined,
    toggleTaskStatus,
  };
}
