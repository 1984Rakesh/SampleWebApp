import type { DashboardStatusLabels, DashboardTaskCounts, DashboardTaskItem } from '../models';

/** Consumer-owned cross-feature data and actions; App adapts them from profile and tasks. */
export interface DashboardCapabilities {
  profileName: string;
  isProfileLoading: boolean;
  taskItems: DashboardTaskItem[];
  counts: DashboardTaskCounts;
  statusLabels: DashboardStatusLabels;
  isTasksLoading: boolean;
  errorMessage?: string;
  toggleTaskStatus(id: string): Promise<void>;
}

/** Outbound links the dashboard needs; App maps them to other features' routes (shared §9). */
export interface DashboardExternalRouting {
  tasksPath: string;
  profilePath: string;
}
