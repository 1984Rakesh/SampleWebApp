import type { TaskCountsViewState, TaskItemViewState } from '../../tasks/presentation/models/TaskListViewState';

export interface DashboardViewState {
  eyebrow: string;
  greeting: string;
  summary: string;
  counts: TaskCountsViewState;
  total: number;
  completionPercent: number;
  dueToday: number;
  dueThisWeek: number;
  recentTasks: TaskItemViewState[];
}
