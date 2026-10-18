import { useState } from 'react';
import { useTaskUseCases } from '../../foundation/composition';
import type { Task, GetTasksInput } from '../../domain/models';
import { validateTaskFilters, nextTaskStatus } from '../../domain/useCases';
import {
  buildStatusOptions,
  buildPriorityOptions,
  withAllOption,
  toTaskStatus,
  toTaskPriority,
  toTaskFormData,
  toTaskItemViewState,
  toTaskCounts,
} from '../models/taskPresentation';

const toErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function useTaskListViewModel() {
  const taskUseCases = useTaskUseCases();

  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<GetTasksInput>({});
  const [actionError, setActionError] = useState<string>();
  const [showForm, setShowForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | undefined>();

  const tasksQuery = taskUseCases.useTasksQuery(appliedFilters);
  const tasks = tasksQuery.data as Task[] | undefined;

  const applyFilters = () => {
    setAppliedFilters(
      validateTaskFilters({
        status: toTaskStatus(statusFilter),
        priority: toTaskPriority(priorityFilter),
      })
    );
  };

  const deleteTask = async (id: string) => {
    try {
      await taskUseCases.deleteTask({ id });
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
      await taskUseCases.toggleTaskStatus({ id, status: nextTaskStatus(task.status) });
    } catch (error) {
      setActionError(toErrorMessage(error, 'Failed to update task status'));
    }
  };

  const openCreateForm = () => {
    setEditingTaskId(undefined);
    setShowForm(true);
  };

  const openEditForm = (id: string) => {
    setEditingTaskId(id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTaskId(undefined);
  };

  const editingTask = editingTaskId ? tasks?.find((task) => task.id === editingTaskId) : undefined;
  const editingFormData = editingTask ? toTaskFormData(editingTask) : undefined;

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
    showForm,
    editingTaskId,
    editingFormData,
    openCreateForm,
    openEditForm,
    closeForm,
    deleteTask,
    toggleTaskStatus,
    isDeleting: taskUseCases.isDeleting,
    isToggling: taskUseCases.isToggling,
  };
}
