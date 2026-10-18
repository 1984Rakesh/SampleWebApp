import type { Task } from '../../domain/models';
import { TaskModel, TaskStatus, TaskPriority } from '../../domain/models';
import type { SelectOption } from './SelectOption';
import type { TaskFormData } from './TaskFormViewState';
import type { BadgeTone, TaskCountsViewState, TaskItemViewState } from './TaskListViewState';

const STATUS_TONES: Record<TaskStatus, BadgeTone> = {
  [TaskStatus.TODO]: 'neutral',
  [TaskStatus.IN_PROGRESS]: 'info',
  [TaskStatus.COMPLETED]: 'success',
};

const PRIORITY_TONES: Record<TaskPriority, BadgeTone> = {
  [TaskPriority.LOW]: 'success',
  [TaskPriority.MEDIUM]: 'warning',
  [TaskPriority.HIGH]: 'danger',
};

export function formatEnumLabel(value: string): string {
  return value
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function toTaskStatus(value: string): TaskStatus | undefined {
  return Object.values(TaskStatus).find((status) => status === value);
}

export function toTaskPriority(value: string): TaskPriority | undefined {
  return Object.values(TaskPriority).find((priority) => priority === value);
}

export function buildStatusOptions(): SelectOption[] {
  return Object.values(TaskStatus).map((status) => ({
    value: status,
    label: formatEnumLabel(status),
  }));
}

export function buildPriorityOptions(): SelectOption[] {
  return Object.values(TaskPriority).map((priority) => ({
    value: priority,
    label: formatEnumLabel(priority),
  }));
}

export function withAllOption(options: SelectOption[]): SelectOption[] {
  return [{ value: '', label: 'All' }, ...options];
}

export function toTaskFormData(task?: Task): TaskFormData {
  return {
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || TaskPriority.MEDIUM,
    dueDate: task?.dueDate || '',
  };
}

export function toTaskItemViewState(task: Task): TaskItemViewState {
  const isCompleted =
    task instanceof TaskModel ? task.isCompleted() : task.status === TaskStatus.COMPLETED;
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    statusLabel: formatEnumLabel(task.status),
    statusTone: STATUS_TONES[task.status],
    priorityLabel: formatEnumLabel(task.priority),
    priorityTone: PRIORITY_TONES[task.priority],
    dueDateLabel: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : undefined,
    toggleLabel: isCompleted ? 'Reopen' : 'Complete',
    toggleAriaLabel: isCompleted ? 'Reopen task' : 'Complete task',
    isCompleted,
  };
}

export function toTaskCounts(tasks: Task[]): TaskCountsViewState {
  return {
    todo: tasks.filter((task) => task.status === TaskStatus.TODO).length,
    inProgress: tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS).length,
    completed: tasks.filter((task) =>
      task instanceof TaskModel ? task.isCompleted() : task.status === TaskStatus.COMPLETED
    ).length,
  };
}
