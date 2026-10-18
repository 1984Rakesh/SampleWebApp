import { ValidationError } from '../errors';

export const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'COMPLETED'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const DEFAULT_TASK_STATUS: TaskStatus = 'TODO';
export const DEFAULT_TASK_PRIORITY: TaskPriority = 'MEDIUM';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewTask {
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
}

export interface TaskChanges {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
}

export function normalizeTaskTitle(title: string): string {
  const normalized = title.trim();
  if (!normalized) {
    throw new ValidationError('Title is required');
  }
  return normalized;
}
