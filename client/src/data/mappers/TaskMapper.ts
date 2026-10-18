import { taskSchema } from './schemas';
import type { Task } from '../../domain/models';
import { TaskModel } from '../../domain/models';

export interface TaskDTO {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export function toDomain(dto: TaskDTO): Task {
  // Server already returns camelCase fields; validate directly.
  const validated = taskSchema.parse(dto);
  return new TaskModel(
    validated.id,
    validated.title,
    validated.status,
    validated.priority,
    validated.userId,
    validated.description,
    validated.dueDate,
    validated.createdAt,
    validated.updatedAt
  );
}

export function toDTO(domain: Partial<Task>): Partial<TaskDTO> {
  return {
    title: domain.title,
    description: domain.description,
    priority: domain.priority,
    dueDate: domain.dueDate,
    status: domain.status,
  };
}
