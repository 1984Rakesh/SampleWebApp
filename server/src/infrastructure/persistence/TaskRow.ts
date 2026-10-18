import type { Task, TaskPriority, TaskStatus } from '../../domain/models/Task';

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

export function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status as TaskStatus,
    priority: row.priority as TaskPriority,
    dueDate: row.due_date,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
