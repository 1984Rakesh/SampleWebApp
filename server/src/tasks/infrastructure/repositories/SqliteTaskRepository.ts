import { randomUUID } from 'crypto';
import type { NewTask, Task, TaskChanges, TaskFilters } from '../../domain/models';
import type { TaskRepository } from '../../domain/ports';
import type { DatabaseConnection } from '../../../foundation/database/connection';
import { rowToTask, type TaskRow } from '../persistence';

export class SqliteTaskRepository implements TaskRepository {
  constructor(private readonly db: DatabaseConnection) {}

  async findAllByUser(userId: string, filters: TaskFilters): Promise<Task[]> {
    let query = 'SELECT * FROM tasks WHERE user_id = ?';
    const params: string[] = [userId];

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.priority) {
      query += ' AND priority = ?';
      params.push(filters.priority);
    }

    query += ' ORDER BY created_at DESC';

    const rows = this.db.prepare(query).all(...params) as TaskRow[];
    return rows.map(rowToTask);
  }

  async create(userId: string, task: NewTask): Promise<Task> {
    const row = this.db
      .prepare(
        `INSERT INTO tasks (id, title, description, status, priority, due_date, user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         RETURNING *`
      )
      .get(
        randomUUID(),
        task.title,
        task.description,
        task.status,
        task.priority,
        task.dueDate,
        userId
      ) as TaskRow;

    return rowToTask(row);
  }

  async update(id: string, userId: string, changes: TaskChanges): Promise<Task | null> {
    const row = this.db
      .prepare(
        `UPDATE tasks
         SET title = COALESCE(?, title),
             description = CASE WHEN ? = 1 THEN ? ELSE description END,
             priority = COALESCE(?, priority),
             due_date = CASE WHEN ? = 1 THEN ? ELSE due_date END,
             status = COALESCE(?, status),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ? AND user_id = ?
         RETURNING *`
      )
      .get(
        changes.title ?? null,
        changes.description !== undefined ? 1 : 0,
        changes.description ?? null,
        changes.priority ?? null,
        changes.dueDate !== undefined ? 1 : 0,
        changes.dueDate ?? null,
        changes.status ?? null,
        id,
        userId
      ) as TaskRow | undefined;

    return row ? rowToTask(row) : null;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = this.db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?').run(id, userId);
    return result.changes > 0;
  }
}
