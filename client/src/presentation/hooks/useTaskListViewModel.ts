import { useState } from 'react';
import { useTaskRepository } from '../../data/repositories';
import type { Task } from '../../domain/models';
import type { GetTasksInput } from '../../domain/useCases';
import {
  getTasksUseCase,
  deleteTaskUseCase,
  toggleTaskStatusUseCase,
  nextTaskStatus,
} from '../../domain/useCases';
import {
  buildStatusOptions,
  buildPriorityOptions,
  withAllOption,
  toTaskStatus,
  toTaskPriority,
  toTaskItemViewState,
  toTaskCounts,
} from '../models/taskPresentation';

const toErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function useTaskListViewModel() {
  const { repository, useTasksQuery, isDeleting, isToggling } = useTaskRepository();

  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<GetTasksInput>({});
  const [actionError, setActionError] = useState<string>();

  const tasksQuery = useTasksQuery(appliedFilters);
  const tasks = tasksQuery.data as Task[] | undefined;

  const applyFilters = () => {
    setAppliedFilters(
      getTasksUseCase({
        status: toTaskStatus(statusFilter),
        priority: toTaskPriority(priorityFilter),
      })
    );
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteTaskUseCase(repository, { id });
    } catch (error) {
      setActionError(toErrorMessage(error, 'Failed to delete task'));
    }
  };

  const toggleTaskStatus = async (id: string) => {
    const task = tasks?.find((candidate) => candidate.id === id);
    if (!task) {
      setActionError('Task not found');
      return;
    }
    try {
      await toggleTaskStatusUseCase(repository, { id, status: nextTaskStatus(task.status) });
    } catch (error) {
      setActionError(toErrorMessage(error, 'Failed to update task status'));
    }
  };

  const taskById = (id: string) => tasks?.find((task) => task.id === id);

  return {
    taskItems: (tasks ?? []).map(toTaskItemViewState),
    counts: toTaskCounts(tasks ?? []),
    isLoading: tasksQuery.isLoading,
    errorMessage: tasksQuery.error ? toErrorMessage(tasksQuery.error, 'Failed to load tasks') : undefined,
    actionError,
    statusFilter,
    priorityFilter,
    setStatusFilter,
    setPriorityFilter,
    applyFilters,
    statusOptions: withAllOption(buildStatusOptions()),
    priorityOptions: withAllOption(buildPriorityOptions()),
    taskById,
    deleteTask,
    toggleTaskStatus,
    isDeleting,
    isToggling,
  };
}
