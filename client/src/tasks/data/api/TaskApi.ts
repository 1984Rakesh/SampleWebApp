import type { AxiosInstance } from 'axios';
import type { TaskDTO, CreateTaskDTO, UpdateTaskDTO, GetTasksParams } from '../dtos';
import { atDataBoundary } from '../../../shared/data';

export function createTaskApi(client: AxiosInstance) {
  return {
    getTasks: (params?: GetTasksParams) => atDataBoundary(async () => {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.append('status', params.status);
      if (params?.priority) searchParams.append('priority', params.priority);
      return (await client.get<TaskDTO[]>(`/tasks?${searchParams.toString()}`)).data;
    }),
    createTask: (input: CreateTaskDTO) =>
      atDataBoundary(async () => (await client.post<TaskDTO>('/tasks', input)).data),
    updateTask: (id: string, input: UpdateTaskDTO) =>
      atDataBoundary(async () => (await client.put<TaskDTO>(`/tasks/${id}`, input)).data),
    deleteTask: (id: string) => atDataBoundary(async () => { await client.delete(`/tasks/${id}`); }),
    toggleTaskStatus: (id: string, status: string) =>
      atDataBoundary(async () => (await client.patch<TaskDTO>(`/tasks/${id}/status`, { status })).data),
  };
}
