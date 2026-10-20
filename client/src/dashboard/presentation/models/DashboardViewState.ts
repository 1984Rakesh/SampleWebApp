export type DashboardBadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export type DashboardDueDateTone = 'amber' | 'muted' | 'default';

export interface DashboardTaskItem {
  id: string;
  title: string;
  description?: string;
  statusLabel: string;
  statusTone: DashboardBadgeTone;
  priorityLabel: string;
  priorityTone: DashboardBadgeTone;
  dueDate?: string;
  dueDateLabel?: string;
  dueDateTone: DashboardDueDateTone;
  createdAt?: string;
  toggleAriaLabel: string;
  isCompleted: boolean;
}

export interface DashboardTaskCounts {
  todo: number;
  inProgress: number;
  completed: number;
}

export interface DashboardViewState {
  eyebrow: string;
  greeting: string;
  summary: string;
  counts: DashboardTaskCounts;
  total: number;
  completionPercent: number;
  dueToday: number;
  dueThisWeek: number;
  recentTasks: DashboardTaskItem[];
}
