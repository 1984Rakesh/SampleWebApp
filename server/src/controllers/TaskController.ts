import { Request, Response } from 'express';
import { randomUUID } from 'crypto';

export async function getTasks(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { status, priority } = req.query;

    const db = (await import('../database/connection')).default;

    let query = 'SELECT * FROM tasks WHERE user_id = ?';
    const params: any[] = [userId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (priority) {
      query += ' AND priority = ?';
      params.push(priority);
    }

    query += ' ORDER BY created_at DESC';

    const tasks = db.prepare(query).all(...params) as any[];

    res.json(
      tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.due_date,
        userId: task.user_id,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
      }))
    );
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}

export async function createTask(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { title, description, priority, dueDate } = req.body;

    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const db = (await import('../database/connection')).default;
    const taskId = randomUUID();

    const insertTask = db.prepare(`
      INSERT INTO tasks (id, title, description, status, priority, due_date, user_id)
      VALUES (?, ?, ?, 'TODO', ?, ?, ?)
    `);

    insertTask.run(taskId, title, description || null, priority || 'MEDIUM', dueDate || null, userId);

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId) as any;

    res.status(201).json({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.due_date,
      userId: task.user_id,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
}

export async function updateTask(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { title, description, priority, dueDate, status } = req.body;

    const db = (await import('../database/connection')).default;

    // Check if task belongs to user
    const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, userId) as any;

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const updateTask = db.prepare(`
      UPDATE tasks
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          priority = COALESCE(?, priority),
          due_date = COALESCE(?, due_date),
          status = COALESCE(?, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    updateTask.run(title, description, priority, dueDate, status, id);

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as any;

    res.json({
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status,
      priority: updatedTask.priority,
      dueDate: updatedTask.due_date,
      userId: updatedTask.user_id,
      createdAt: updatedTask.created_at,
      updatedAt: updatedTask.updated_at,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const db = (await import('../database/connection')).default;

    // Check if task belongs to user
    const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, userId) as any;

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
}

export async function toggleStatus(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['TODO', 'IN_PROGRESS', 'COMPLETED'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const db = (await import('../database/connection')).default;

    // Check if task belongs to user
    const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, userId) as any;

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    db.prepare('UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, id);

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as any;

    res.json({
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status,
      priority: updatedTask.priority,
      dueDate: updatedTask.due_date,
      userId: updatedTask.user_id,
      createdAt: updatedTask.created_at,
      updatedAt: updatedTask.updated_at,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle task status' });
  }
}
