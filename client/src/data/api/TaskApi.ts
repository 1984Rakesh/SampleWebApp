import axiosClient from '../../foundation/network/axiosClient';
import type { TaskDTO, CreateTaskDTO, UpdateTaskDTO, GetTasksParams } from '../dtos';

export const taskApi = {
  async getTasks(params?: GetTasksParams): Promise<TaskDTO[]> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.priority) searchParams.append('priority', params.priority);

    const response = await axiosClient.get<TaskDTO[]>(`/tasks?${searchParams.toString()}`);
    return response.data;
  },

  async createTask(input: CreateTaskDTO): Promise<TaskDTO> {
    const response = await axiosClient.post<TaskDTO>('/tasks', input);
    return response.data;
  },

  async updateTask(id: string, input: UpdateTaskDTO): Promise<TaskDTO> {
    const response = await axiosClient.put<TaskDTO>(`/tasks/${id}`, input);
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await axiosClient.delete(`/tasks/${id}`);
  },

  async toggleTaskStatus(id: string, status: string): Promise<TaskDTO> {
    const response = await axiosClient.patch<TaskDTO>(`/tasks/${id}/status`, { status });
    return response.data;
  },
};
