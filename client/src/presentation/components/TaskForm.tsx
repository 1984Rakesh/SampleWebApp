import type { FormEvent } from 'react';
import { UiCard, UiCardContent, UiCardHeader, UiTextField, UiSelect, UiButton, UiAlert, UiStack } from './ui';
import type { SelectOption } from '../models/SelectOption';
import type { TaskFormData, TaskFormFieldErrors } from '../models/TaskFormViewState';

interface TaskFormProps {
  title: string;
  submitLabel: string;
  formData: TaskFormData;
  priorityOptions: SelectOption[];
  errors: TaskFormFieldErrors;
  submitError?: string;
  onSubmit: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitDisabled?: boolean;
  updateField: (field: keyof TaskFormData, value: string) => void;
}

export default function TaskForm({
  title,
  submitLabel,
  formData,
  priorityOptions,
  errors,
  submitError,
  onSubmit,
  onCancel,
  isLoading = false,
  submitDisabled = false,
  updateField,
}: TaskFormProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <UiCard>
      <UiCardHeader title={title} />
      <UiCardContent>
        {submitError && (
          <UiAlert type="error" gutterBottom>
            {submitError}
          </UiAlert>
        )}

        <form onSubmit={handleSubmit}>
          <UiStack spacing={2}>
            <UiTextField
              id="title"
              label="Title"
              value={formData.title}
              onChange={(value) => updateField('title', value)}
              error={!!errors.title}
              helperText={errors.title}
              disabled={isLoading}
              required
            />
            <UiTextField
              id="description"
              label="Description"
              value={formData.description}
              onChange={(value) => updateField('description', value)}
              disabled={isLoading}
              multiline
              rows={3}
            />
            <UiSelect
              id="priority"
              label="Priority"
              value={formData.priority}
              options={priorityOptions}
              onChange={(value) => updateField('priority', value)}
              error={!!errors.priority}
              helperText={errors.priority}
              disabled={isLoading}
            />
            <UiTextField
              id="dueDate"
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(value) => updateField('dueDate', value)}
              disabled={isLoading}
            />
            <UiStack direction="row" spacing={2}>
              <UiButton
                type="submit"
                variant="solid"
                fullWidth
                isLoading={isLoading}
                disabled={submitDisabled || isLoading}
              >
                {submitLabel}
              </UiButton>
              {onCancel && (
                <UiButton
                  variant="outline"
                  fullWidth
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancel
                </UiButton>
              )}
            </UiStack>
          </UiStack>
        </form>
      </UiCardContent>
    </UiCard>
  );
}
