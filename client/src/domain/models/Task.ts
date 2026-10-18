import { TaskStatus, TaskPriority } from './enums';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetTasksInput {
  status?: TaskStatus;
  priority?: TaskPriority;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface DeleteTaskInput {
  id: string;
}

export interface ToggleTaskStatusInput {
  id: string;
  status: TaskStatus;
}

export function normalizeTaskTitle(title: string): string {
  const normalized = title.trim();
  if (!normalized) {
    throw new Error('Title is required');
  }
  return normalized;
}

export class TaskModel implements Task {
  constructor(
    public id: string,
    public title: string,
    public status: TaskStatus,
    public priority: TaskPriority,
    public userId: string,
    public description?: string,
    public dueDate?: string,
    public createdAt?: string,
    public updatedAt?: string
  ) {}

  isValid(): boolean {
    return (
      this.id.length > 0 &&
      this.title.trim().length > 0 &&
      this.userId.length > 0 &&
      this.isValidStatus() &&
      this.isValidPriority()
    );
  }

  private isValidStatus(): boolean {
    return Object.values(TaskStatus).includes(this.status);
  }

  private isValidPriority(): boolean {
    return Object.values(TaskPriority).includes(this.priority);
  }

  isCompleted(): boolean {
    return this.status === TaskStatus.COMPLETED;
  }

  isOverdue(): boolean {
    if (!this.dueDate) return false;
    const due = new Date(this.dueDate);
    const now = new Date();
    return due < now && !this.isCompleted();
  }
}
