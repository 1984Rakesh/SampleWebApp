import { useAuthViewModel } from './useAuthViewModel';
import { useTaskListViewModel } from './useTaskListViewModel';
import { useUserViewModel } from './useUserViewModel';
import { toDashboardViewState } from '../models/dashboardPresentation';

export function useDashboardViewModel() {
  const { userName } = useAuthViewModel();
  const { profile, isLoading: userLoading } = useUserViewModel();
  const tasks = useTaskListViewModel();
  return {
    dashboard: toDashboardViewState(profile?.name || userName || 'User', tasks.taskItems, tasks.counts),
    isLoading: userLoading || tasks.isLoading,
    errorMessage: tasks.errorMessage,
    toggleTaskStatus: tasks.toggleTaskStatus,
  };
}
