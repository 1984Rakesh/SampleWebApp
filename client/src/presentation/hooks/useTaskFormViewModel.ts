import { useState } from 'react';
import { useTaskRepository } from '../../data/repositories';
import type { Task } from '../../domain/models';
import { TaskPriority } from '../../domain/models';
import type { TaskFormData } from '../components/TaskForm';

export function useTaskFormViewModel(task?: Task) {
  const { useCreateTaskMutation, useUpdateTaskMutation } = useTaskRepository();
  const [formData, setFormData] = useState<TaskFormData>({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || TaskPriority.MEDIUM,
    dueDate: task?.dueDate || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateTaskMutation();
  const updateMutation = useUpdateTaskMutation();

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
        // Update existing task
        const result = await updateMutation.mutateAsync({
          id: task.id,
          input: formData,
        });
        return result;
      } else {
        // Create new task
        const result = await createMutation.mutateAsync(formData);
        return result;
      }
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to save task' });
      throw error;
    }
  };

  const updateField = (field: keyof TaskFormData, value: string | TaskPriority) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
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
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isSuccess: createMutation.isSuccess || updateMutation.isSuccess,
    error: errors.submit || createMutation.error || updateMutation.error,
  };
}
