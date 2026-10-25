import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from '../../domain/models';
import { normalizeSqliteTimestamp } from '../../../foundation/persistence';

export interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

function toTaskStatus(value: string): TaskStatus {
  const status = TASK_STATUSES.find((status) => status === value);
  if (!status) throw new Error('Invalid persisted task status');
  return status;
}

function toTaskPriority(value: string): TaskPriority {
  const priority = TASK_PRIORITIES.find((priority) => priority === value);
  if (!priority) throw new Error('Invalid persisted task priority');
  return priority;
}

export function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: toTaskStatus(row.status),
    priority: toTaskPriority(row.priority),
    dueDate: row.due_date,
    userId: row.user_id,
    createdAt: normalizeSqliteTimestamp(row.created_at),
    updatedAt: normalizeSqliteTimestamp(row.updated_at),
  };
}
