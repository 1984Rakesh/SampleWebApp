export type TaskStatusVariant = 'status-todo' | 'status-progress' | 'status-done';

export type TaskPriorityVariant = 'priority-high' | 'priority-medium' | 'priority-low';

export type DueDateTone = 'amber' | 'muted' | 'default';

export interface TaskItemViewState {
  id: string;
  title: string;
  description?: string;
  statusLabel: string;
  statusVariant: TaskStatusVariant;
  priorityLabel: string;
  priorityVariant: TaskPriorityVariant;
  dueDate?: string;
  dueDateLabel?: string;
  dueDateTone: DueDateTone;
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
