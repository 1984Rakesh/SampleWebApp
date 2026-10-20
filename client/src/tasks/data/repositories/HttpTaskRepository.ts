import type { createTaskApi } from '../api/TaskApi';
import type { TaskRepository } from '../../domain/repositories/TaskRepository';
import { toDomain, toCreateTaskDTO, toUpdateTaskDTO } from '../mappers/TaskMapper';

export function createTaskRepository(api: ReturnType<typeof createTaskApi>): TaskRepository {
  return {
    getTasks: async (input) => (await api.getTasks(input)).map(toDomain),
    createTask: async (input) => toDomain(await api.createTask(toCreateTaskDTO(input))),
    updateTask: async ({ id, ...updates }) => toDomain(await api.updateTask(id, toUpdateTaskDTO(updates))),
    deleteTask: (id) => api.deleteTask(id),
    toggleTaskStatus: async ({ id, status }) => toDomain(await api.toggleTaskStatus(id, status)),
  };
}
