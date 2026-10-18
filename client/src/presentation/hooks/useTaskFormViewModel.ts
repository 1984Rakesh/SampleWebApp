import { useState } from 'react';
import { useAuth } from '../../foundation/context';
import { useCreateTaskUseCase, useUpdateTaskUseCase } from '../../domain/useCases';
import type { Task } from '../../domain/models';
import { TaskPriority } from '../../domain/models';
import type { TaskFormData } from '../components/TaskForm';

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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<Task | void> => {
    if (!validate()) {
      return;
    }

    try {
      if (task) {
        const result = await updateTask.mutateAsync({
          id: task.id,
          ...formData,
        });
        return result;
      } else {
        const result = await createTask.mutateAsync(formData);
        return result;
      }
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to save task' });
      throw error;
    }
  };

  const updateField = (field: keyof TaskFormData, value: string | TaskPriority) => {
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
    formData,
    updateField,
    errors,
    handleSubmit,
    isSubmitting: createTask.isPending || updateTask.isPending,
    isSuccess: createTask.isSuccess || updateTask.isSuccess,
    error: errors.submit || createTask.error || updateTask.error,
  };
}
