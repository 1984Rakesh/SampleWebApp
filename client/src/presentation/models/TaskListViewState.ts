export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface TaskItemViewState {
  id: string;
  title: string;
  description?: string;
  statusLabel: string;
  statusTone: BadgeTone;
  priorityLabel: string;
  priorityTone: BadgeTone;
  dueDate?: string;
  dueDateLabel?: string;
  createdAt?: string;
  searchText: string;
  statusValue: string;
  priorityValue: string;
  toggleLabel: string;
  toggleAriaLabel: string;
  isCompleted: boolean;
}

export interface TaskCountsViewState {
  todo: number;
  inProgress: number;
  completed: number;
}
