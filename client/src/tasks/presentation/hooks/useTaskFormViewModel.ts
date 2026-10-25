import { useState } from 'react';
import { useTaskUseCases } from '../context';
import { buildPriorityOptions, toTaskFormData, toTaskPriority, type TaskFormData, type TaskFormFieldErrors } from '../models';

export function useTaskFormViewModel(editingTaskId?: string, initialData?: TaskFormData) {
  const taskUseCases = useTaskUseCases();

  const [formData, setFormData] = useState<TaskFormData>(() => initialData ?? toTaskFormData());
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
      if (editingTaskId) {
        await taskUseCases.updateTask({ id: editingTaskId, ...formData, priority });
      } else {
        await taskUseCases.createTask({
          ...formData,
          priority,
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
    title: editingTaskId ? 'Edit Task' : 'Create Task',
    submitLabel: editingTaskId ? 'Update' : 'Create',
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
