import { taskSchema } from '../dtos';
import type { TaskDTO, CreateTaskDTO, UpdateTaskDTO } from '../dtos';
import type { Task } from '../../domain/models';
import { TaskModel } from '../../domain/models';
import type { CreateTaskInput, UpdateTaskInput } from '../../domain/useCases';

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

export function toCreateTaskDTO(input: CreateTaskInput): CreateTaskDTO {
  return {
    title: input.title,
    description: input.description,
    priority: input.priority,
    dueDate: input.dueDate,
  };
}

export function toUpdateTaskDTO(input: Omit<UpdateTaskInput, 'id'>): UpdateTaskDTO {
  return {
    title: input.title,
    description: input.description,
    status: input.status,
    priority: input.priority,
    dueDate: input.dueDate,
  };
}
