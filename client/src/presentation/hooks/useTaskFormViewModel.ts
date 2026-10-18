import { useState } from 'react';
import { useAuth } from '../../foundation/context';
import { useTaskUseCases } from '../../foundation/composition';
import type { Task } from '../../domain/models';
import { TaskPriority } from '../../domain/models';
import type { TaskFormData, TaskFormFieldErrors } from '../models/TaskFormViewState';
import { buildPriorityOptions, toTaskPriority } from '../models/taskPresentation';

export function useTaskFormViewModel(task?: Task) {
  const { user } = useAuth();
  const taskUseCases = useTaskUseCases();

  const [formData, setFormData] = useState<TaskFormData>({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || TaskPriority.MEDIUM,
    dueDate: task?.dueDate || '',
  });
  const [fieldErrors, setFieldErrors] = useState<TaskFormFieldErrors>({});
  const [submitError, setSubmitError] = useState<string>();

  const priorityOptions = buildPriorityOptions();
  const canSubmit = formData.title.trim().length > 0;
  const isSubmitting = taskUseCases.isCreating || taskUseCases.isUpdating;

  const submit = async (): Promise<boolean> => {
    const errors: TaskFormFieldErrors = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    const priority = toTaskPriority(formData.priority);
    if (!priority) {
      errors.priority = 'Select a valid priority';
    }

    setFieldErrors(errors);
    setSubmitError(undefined);
    if (Object.keys(errors).length > 0 || !priority) {
      return false;
    }

    try {
      if (task) {
        await taskUseCases.updateTask({ id: task.id, ...formData, priority });
      } else {
        await taskUseCases.createTask({
          ...formData,
          priority,
          userId: user?.id ?? '',
        });
      }
      return true;
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to save task');
      return false;
    }
  };

  const updateField = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (submitError) {
      setSubmitError(undefined);
    }
  };

  return {
    title: task ? 'Edit Task' : 'Create Task',
    submitLabel: task ? 'Update' : 'Create',
    formData,
    priorityOptions,
    fieldErrors,
    submitError,
    canSubmit,
    updateField,
    submit,
    isSubmitting,
  };
}
