import { useDashboardCapabilities, useDashboardRouting } from '../context';
import { toDashboardViewState } from '../models';

export function useDashboardViewModel() {
  const capabilities = useDashboardCapabilities();
  const routing = useDashboardRouting();
  return {
    dashboard: toDashboardViewState(capabilities.profileName, capabilities.taskItems, capabilities.counts),
    statusLabels: capabilities.statusLabels,
    isLoading: capabilities.isProfileLoading || capabilities.isTasksLoading,
    errorMessage: capabilities.errorMessage,
    toggleTaskStatus: capabilities.toggleTaskStatus,
    links: { tasks: routing.tasksPath, profile: routing.profilePath },
  };
}
