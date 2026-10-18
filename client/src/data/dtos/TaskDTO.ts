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

export interface CreateTaskDTO {
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
}

export interface GetTasksParams {
  status?: string;
  priority?: string;
}
