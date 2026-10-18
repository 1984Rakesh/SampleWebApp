import {
  DEFAULT_TASK_PRIORITY,
  DEFAULT_TASK_STATUS,
  TASK_PRIORITIES,
  TASK_STATUSES,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from '../../domain/models/Task';

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
  return (TASK_STATUSES as readonly string[]).includes(value)
    ? (value as TaskStatus)
    : DEFAULT_TASK_STATUS;
}

function toTaskPriority(value: string): TaskPriority {
  return (TASK_PRIORITIES as readonly string[]).includes(value)
    ? (value as TaskPriority)
    : DEFAULT_TASK_PRIORITY;
}

export function normalizeSqliteTimestamp(timestamp: string): string {
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(timestamp)) {
    return `${timestamp.replace(' ', 'T')}Z`;
  }
  return timestamp;
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
