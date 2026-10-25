import type { createTaskApi } from '../api';
import type { TaskRepository } from '../../domain/repositories';
import { taskToDomain, toCreateTaskDTO, toUpdateTaskDTO } from '../mappers';

export function createTaskRepository(api: ReturnType<typeof createTaskApi>): TaskRepository {
  return {
    getTasks: async (input) => (await api.getTasks(input)).map(taskToDomain),
    createTask: async (input) => taskToDomain(await api.createTask(toCreateTaskDTO(input))),
    updateTask: async ({ id, ...updates }) => taskToDomain(await api.updateTask(id, toUpdateTaskDTO(updates))),
    deleteTask: (id) => api.deleteTask(id),
    toggleTaskStatus: async ({ id, status }) => taskToDomain(await api.toggleTaskStatus(id, status)),
  };
}
