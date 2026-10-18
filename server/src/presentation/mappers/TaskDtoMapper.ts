import type { Task } from '../../domain/models/Task';
import type { TaskResponse } from '../schemas/TaskDto';

export function taskToResponse(task: Task): TaskResponse {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    userId: task.userId,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}
