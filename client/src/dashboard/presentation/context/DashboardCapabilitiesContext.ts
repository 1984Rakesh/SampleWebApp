import { createContext, useContext } from 'react';
import type { DashboardStatusLabels, DashboardTaskCounts, DashboardTaskItem } from '../models';

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

export const DashboardCapabilitiesContext = createContext<DashboardCapabilities | undefined>(undefined);

export function useDashboardCapabilities(): DashboardCapabilities {
  const value = useContext(DashboardCapabilitiesContext);
  if (!value) throw new Error('Dashboard capabilities must be supplied by App');
  return value;
}
