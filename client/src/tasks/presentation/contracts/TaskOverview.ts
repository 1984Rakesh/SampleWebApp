import type { TaskCountsViewState, TaskItemViewState } from '../models';

export type TaskOverviewItem = TaskItemViewState;
export type TaskOverviewCounts = TaskCountsViewState;

export interface TaskStatusLabels {
  todo: string;
  inProgress: string;
  completed: string;
}

/** Read-only task summary other features consume through App-adapted contracts. */
export interface TaskOverview {
  items: TaskOverviewItem[];
  counts: TaskOverviewCounts;
  isLoading: boolean;
  errorMessage?: string;
  toggleStatus(id: string): Promise<void>;
}
