import axiosClient from '../../foundation/network/axiosClient';
import type { TaskDTO } from '../mappers/TaskMapper';
import { TaskStatus } from '../../domain/models';
import type { GetTasksInput } from '../../domain/useCases';

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: string;
  dueDate?: string;
}

export const taskApi = {
  async getTasks(input?: GetTasksInput): Promise<TaskDTO[]> {
    const params = new URLSearchParams();
    if (input?.status) params.append('status', input.status);
    if (input?.priority) params.append('priority', input.priority);

    const response = await axiosClient.get<TaskDTO[]>(`/tasks?${params.toString()}`);
    return response.data;
  },

  async createTask(input: CreateTaskInput): Promise<TaskDTO> {
    const response = await axiosClient.post<TaskDTO>('/tasks', input);
    return response.data;
  },

  async updateTask(id: string, input: UpdateTaskInput): Promise<TaskDTO> {
    const response = await axiosClient.put<TaskDTO>(`/tasks/${id}`, input);
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await axiosClient.delete(`/tasks/${id}`);
  },

  async toggleTaskStatus(id: string, status: TaskStatus): Promise<TaskDTO> {
    const response = await axiosClient.patch<TaskDTO>(`/tasks/${id}/status`, { status });
    return response.data;
  },
};
