import { taskSchema } from './schemas';
import type { Task } from '../../domain/models';
import { TaskModel } from '../../domain/models';

export interface TaskDTO {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export function toDomain(dto: TaskDTO): Task {
  // Transform DTO fields (snake_case) to domain fields (camelCase)
  const domainData = {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    status: dto.status,
    priority: dto.priority,
    dueDate: dto.due_date,
    userId: dto.user_id,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
  const validated = taskSchema.parse(domainData);
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
    due_date: domain.dueDate,
    status: domain.status,
  };
}
