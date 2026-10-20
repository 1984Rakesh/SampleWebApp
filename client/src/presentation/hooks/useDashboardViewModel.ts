import { useTaskListViewModel } from '../../tasks/presentation/hooks/useTaskListViewModel';
import { useDashboardProfile } from '../context';
import { toDashboardViewState } from '../models/dashboardPresentation';

export function useDashboardViewModel() {
  const profile = useDashboardProfile();
  const tasks = useTaskListViewModel();
  return {
    dashboard: toDashboardViewState(profile.name, tasks.taskItems, tasks.counts),
    isLoading: profile.isLoading || tasks.isLoading,
    errorMessage: tasks.errorMessage,
    toggleTaskStatus: tasks.toggleTaskStatus,
  };
}
