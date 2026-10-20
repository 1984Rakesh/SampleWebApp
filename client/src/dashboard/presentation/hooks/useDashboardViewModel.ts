import { useDashboardCapabilities } from '../context';
import { toDashboardViewState } from '../models/dashboardPresentation';

export function useDashboardViewModel() {
  const capabilities = useDashboardCapabilities();
  return {
    dashboard: toDashboardViewState(capabilities.profileName, capabilities.taskItems, capabilities.counts),
    isLoading: capabilities.isProfileLoading || capabilities.isTasksLoading,
    errorMessage: capabilities.errorMessage,
    toggleTaskStatus: capabilities.toggleTaskStatus,
  };
}
