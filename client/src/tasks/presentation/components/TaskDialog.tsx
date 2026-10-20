import type { FormEvent } from 'react';
import { useTaskFormViewModel } from '../hooks';
import type { TaskFormData } from '../models/TaskFormViewState';
import { UiAlert, UiButton, UiDialog, UiFormFooter, UiGrid, UiGridItem, UiStack, UiText, UiTextField, UiToggleGroup } from '../../../components/ui';

interface TaskDialogProps {
  open: boolean;
  editingTaskId?: string;
  initialData?: TaskFormData;
  onClose: () => void;
}

export default function TaskDialog({ open, editingTaskId, initialData, onClose }: TaskDialogProps) {
  const form = useTaskFormViewModel(editingTaskId, initialData);
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (await form.submit()) onClose();
  };

  return (
    <UiDialog
      open={open}
      onClose={onClose}
      title={editingTaskId ? 'Edit task' : 'New task'}
      description="Add the details. You can change them later."
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit}>
        <UiStack spacing={2}>
          {form.submitError && <UiAlert type="error">{form.submitError}</UiAlert>}
          <UiTextField
            id="task-title"
            label="Title"
            value={form.formData.title}
            onChange={(value) => form.updateField('title', value)}
            error={!!form.fieldErrors.title}
            helperText={form.fieldErrors.title}
            required
            autoFocus
            disabled={form.isSubmitting}
          />
          <UiTextField id="task-description" label="Description" value={form.formData.description} onChange={(value) => form.updateField('description', value)} multiline rows={3} disabled={form.isSubmitting} />
          <UiGrid spacing={2}>
            <UiGridItem sm={6}>
              <UiStack spacing={1}>
                <UiText variant="body2" weight="medium">Priority</UiText>
                <UiToggleGroup value={form.formData.priority} options={form.priorityOptions} onChange={(value) => form.updateField('priority', value)} fullWidth ariaLabel="Priority" />
              </UiStack>
            </UiGridItem>
            <UiGridItem sm={6}>
              <UiTextField id="task-due-date" label="Due date" type="date" value={form.formData.dueDate} onChange={(value) => form.updateField('dueDate', value)} disabled={form.isSubmitting} />
            </UiGridItem>
          </UiGrid>
          <UiFormFooter>
            <UiButton variant="outline" fullWidthBelow="sm" onClick={onClose} disabled={form.isSubmitting}>Cancel</UiButton>
            <UiButton type="submit" variant="solid" fullWidthBelow="sm" isLoading={form.isSubmitting} disabled={!form.canSubmit}>{editingTaskId ? 'Save changes' : 'Create task'}</UiButton>
          </UiFormFooter>
        </UiStack>
      </form>
    </UiDialog>
  );
}
