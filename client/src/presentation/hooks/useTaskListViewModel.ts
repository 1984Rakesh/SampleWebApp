import { useState } from 'react';
import { useTaskUseCases } from '../context';
import type { Task } from '../../domain/models';
import { nextTaskStatus } from '../../domain/useCases';
import {
  buildStatusOptions,
  buildPriorityOptions,
  withAllOption,
  toTaskFormData,
  toTaskItemViewState,
  toTaskCounts,
} from '../models/taskPresentation';

const toErrorMessage = (error: unknown, fallback: string) => error instanceof Error ? error.message : fallback;

export function useTaskListViewModel() {
  const taskUseCases = useTaskUseCases();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [actionError, setActionError] = useState<string>();
  const [showForm, setShowForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string>();
  const tasksQuery = taskUseCases.useTasksQuery({});
  const tasks = tasksQuery.data as Task[] | undefined;
  const allItems = (tasks ?? []).map(toTaskItemViewState);
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const taskItems = allItems.filter((task) =>
    (!normalizedSearch || task.searchText.includes(normalizedSearch)) &&
    (!statusFilter || task.statusValue === statusFilter) &&
    (!priorityFilter || task.priorityValue === priorityFilter)
  );

  const deleteTask = async (id: string) => {
    try { await taskUseCases.deleteTask({ id }); }
    catch (error) { setActionError(toErrorMessage(error, 'Failed to delete task')); }
  };
  const toggleTaskStatus = async (id: string) => {
    const task = tasks?.find((candidate) => candidate.id === id);
    if (!task) { setActionError('Task not found'); return; }
    try { await taskUseCases.toggleTaskStatus({ id, status: nextTaskStatus(task.status) }); }
    catch (error) { setActionError(toErrorMessage(error, 'Failed to update task status')); }
  };
  const openCreateForm = () => { setEditingTaskId(undefined); setShowForm(true); };
  const openEditForm = (id: string) => { setEditingTaskId(id); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditingTaskId(undefined); };
  const editingTask = editingTaskId ? tasks?.find((task) => task.id === editingTaskId) : undefined;

  return {
    taskItems,
    allTaskItems: allItems,
    counts: toTaskCounts(tasks ?? []),
    total: allItems.length,
    isLoading: tasksQuery.isLoading,
    errorMessage: tasksQuery.error ? toErrorMessage(tasksQuery.error, 'Failed to load tasks') : undefined,
    actionError,
    searchQuery,
    statusFilter,
    priorityFilter,
    setSearchQuery,
    setStatusFilter,
    setPriorityFilter,
    statusOptions: withAllOption(buildStatusOptions()),
    priorityOptions: withAllOption(buildPriorityOptions()),
    showForm,
    editingTaskId,
    editingFormData: editingTask ? toTaskFormData(editingTask) : undefined,
    openCreateForm,
    openEditForm,
    closeForm,
    deleteTask,
    toggleTaskStatus,
    isDeleting: taskUseCases.isDeleting,
    isToggling: taskUseCases.isToggling,
  };
}
