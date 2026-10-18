import { useState } from 'react';
import { useAuth } from '../../foundation/context';
import { useCreateTaskUseCase, useUpdateTaskUseCase } from '../../domain/useCases';
import type { Task } from '../../domain/models';
import { TaskPriority } from '../../domain/models';
import type { TaskFormData } from '../models/TaskFormViewState';

const formatOptionLabel = (value: string) =>
  value
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());

const getTaskPriority = (value: string) =>
  Object.values(TaskPriority).find((priority) => priority === value);

export function useTaskFormViewModel(task?: Task) {
  const { user } = useAuth();
  const createTask = useCreateTaskUseCase(user?.id ?? '');
  const updateTask = useUpdateTaskUseCase();

  const [formData, setFormData] = useState<TaskFormData>({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || TaskPriority.MEDIUM,
    dueDate: task?.dueDate || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const priorityOptions = Object.values(TaskPriority).map((priority) => ({
    value: priority,
    label: formatOptionLabel(priority),
  }));

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!getTaskPriority(formData.priority)) {
      newErrors.priority = 'Select a valid priority';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<Task | void> => {
    if (!validate()) {
      return;
    }

    const priority = getTaskPriority(formData.priority);
    if (!priority) return;

    const taskData = { ...formData, priority };

    try {
      if (task) {
        const result = await updateTask.mutateAsync({
          id: task.id,
          ...taskData,
        });
        return result;
      } else {
        const result = await createTask.mutateAsync(taskData);
        return result;
      }
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to save task' });
      throw error;
    }
  };

  const updateField = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return {
    title: task ? 'Edit Task' : 'Create Task',
    submitLabel: task ? 'Update' : 'Create',
    formData,
    priorityOptions,
    updateField,
    errors,
    handleSubmit,
    isSubmitting: createTask.isPending || updateTask.isPending,
    isSuccess: createTask.isSuccess || updateTask.isSuccess,
    error: errors.submit || createTask.error || updateTask.error,
  };
}
