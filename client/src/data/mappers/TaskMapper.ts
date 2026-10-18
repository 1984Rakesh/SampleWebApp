import { taskSchema } from './schemas';
import type { Task } from '../../domain/models';
import { TaskModel } from '../../domain/models';

export interface TaskDTO {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  dueDate?: string | null;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  due_date?: string | null;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export function toDomain(dto: TaskDTO): Task {
  // Normalize current and legacy transport fields before domain validation.
  const validated = taskSchema.parse({
    id: dto.id,
    title: dto.title,
    description: dto.description ?? undefined,
    status: dto.status,
    priority: dto.priority,
    dueDate: dto.dueDate ?? dto.due_date ?? undefined,
    userId: dto.userId ?? dto.user_id,
    createdAt: dto.createdAt ?? dto.created_at,
    updatedAt: dto.updatedAt ?? dto.updated_at,
  });
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
