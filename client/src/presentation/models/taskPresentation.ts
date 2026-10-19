import type { Task } from '../../domain/models';
import { TaskModel, TaskStatus, TaskPriority } from '../../domain/models';
import type { SelectOption } from './SelectOption';
import type { TaskFormData } from './TaskFormViewState';
import type { BadgeTone, DueDateTone, TaskCountsViewState, TaskItemViewState } from './TaskListViewState';

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

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDueDate(isoDate: string, now = new Date()): { label: string; tone: DueDateTone } {
  const due = new Date(isoDate + 'T00:00:00');
  const todayKey = dayKey(now);
  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(now.getDate() + 1);
  const tomorrowKey = dayKey(tomorrowDate);
  const dueKey = dayKey(due);

  if (dueKey === todayKey) return { label: 'Today', tone: 'amber' };
  if (dueKey === tomorrowKey) return { label: 'Tomorrow', tone: 'default' };

  const isPast = due < now && dueKey !== todayKey;
  if (isPast) {
    return { label: due.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), tone: 'muted' };
  }
  return { label: due.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }), tone: 'default' };
}

export function toTaskItemViewState(task: Task): TaskItemViewState {
  const isCompleted =
    task instanceof TaskModel ? task.isCompleted() : task.status === TaskStatus.COMPLETED;
  const dueDateInfo = task.dueDate ? formatDueDate(task.dueDate) : undefined;
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    statusLabel: formatEnumLabel(task.status),
    statusTone: STATUS_TONES[task.status],
    priorityLabel: formatEnumLabel(task.priority),
    priorityTone: PRIORITY_TONES[task.priority],
    dueDate: task.dueDate,
    dueDateLabel: dueDateInfo?.label,
    dueDateTone: dueDateInfo?.tone ?? 'muted',
    createdAt: task.createdAt,
    searchText: `${task.title} ${task.description ?? ''}`.toLowerCase(),
    statusValue: task.status,
    priorityValue: task.priority,
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
