import type { FormEvent } from 'react';
import Stack from '@mui/material/Stack';
import { UiCard, UiCardContent, UiCardHeader, UiTextField, UiSelect, UiButton, UiAlert } from './ui';
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
          <UiAlert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </UiAlert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <UiTextField
              id="title"
              label="Title"
              value={formData.title}
              onChange={(event) => updateField('title', event.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              disabled={isLoading}
              required
            />
            <UiTextField
              id="description"
              label="Description"
              value={formData.description}
              onChange={(event) => updateField('description', event.target.value)}
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
              onChange={(event) => updateField('dueDate', event.target.value)}
              disabled={isLoading}
              InputLabelProps={{ shrink: true }}
            />
            <Stack direction="row" spacing={2}>
              <UiButton
                type="submit"
                variant="contained"
                fullWidth
                isLoading={isLoading}
                disabled={submitDisabled || isLoading}
              >
                {submitLabel}
              </UiButton>
              {onCancel && (
                <UiButton
                  type="button"
                  variant="outlined"
                  fullWidth
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancel
                </UiButton>
              )}
            </Stack>
          </Stack>
        </form>
      </UiCardContent>
    </UiCard>
  );
}
