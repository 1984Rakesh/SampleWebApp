export type DashboardStatusVariant = 'status-todo' | 'status-progress' | 'status-done';

export type DashboardPriorityVariant = 'priority-high' | 'priority-medium' | 'priority-low';

export type DashboardDueDateTone = 'amber' | 'muted' | 'default';

export interface DashboardTaskItem {
  id: string;
  title: string;
  description?: string;
  statusLabel: string;
  statusVariant: DashboardStatusVariant;
  priorityLabel: string;
  priorityVariant: DashboardPriorityVariant;
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

export interface DashboardStatusLabels {
  completed: string;
  inProgress: string;
  todo: string;
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
