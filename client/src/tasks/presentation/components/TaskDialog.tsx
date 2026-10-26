import type { FormEvent } from 'react';
import { Loader2, OctagonX } from 'lucide-react';
import { useTaskFormViewModel } from '../hooks';
import type { TaskFormData } from '../models';
import {
  Alert,
  AlertDescription,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Textarea,
  ToggleGroup,
  ToggleGroupItem,
} from '../../../components/ui';

interface TaskDialogProps {
  open: boolean;
  editingTaskId?: string;
  initialData?: TaskFormData;
  onClose: () => void;
}

const priorityTint: Record<string, string> = {
  HIGH: 'data-[state=on]:bg-priority-high data-[state=on]:text-priority-high-foreground',
  MEDIUM: 'data-[state=on]:bg-priority-medium data-[state=on]:text-priority-medium-foreground',
  LOW: 'data-[state=on]:bg-priority-low data-[state=on]:text-priority-low-foreground',
};

export default function TaskDialog({ open, editingTaskId, initialData, onClose }: TaskDialogProps) {
  const form = useTaskFormViewModel(editingTaskId, initialData);
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (await form.submit()) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{editingTaskId ? 'Edit task' : 'New task'}</DialogTitle>
          <DialogDescription>Add the details. You can change them later.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            {form.submitError && (
              <Alert variant="destructive">
                <OctagonX />
                <AlertDescription>{form.submitError}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-1.5">
              <Label htmlFor="task-title">
                Title <span aria-hidden="true" className="text-destructive">*</span>
              </Label>
              <Input
                id="task-title"
                value={form.formData.title}
                onChange={(event) => form.updateField('title', event.target.value)}
                aria-invalid={!!form.fieldErrors.title || undefined}
                aria-describedby={form.fieldErrors.title ? 'task-title-helper' : undefined}
                required
                autoFocus
                disabled={form.isSubmitting}
              />
              {form.fieldErrors.title && (
                <p id="task-title-helper" className="text-sm text-destructive">{form.fieldErrors.title}</p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                value={form.formData.description}
                onChange={(event) => form.updateField('description', event.target.value)}
                rows={3}
                disabled={form.isSubmitting}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Priority</p>
                <ToggleGroup
                  type="single"
                  className="w-full"
                  value={form.formData.priority}
                  onValueChange={(value) => value && form.updateField('priority', value)}
                  aria-label="Priority"
                >
                  {form.priorityOptions.map((option) => (
                    <ToggleGroupItem key={option.value} value={option.value} className={`flex-1 ${priorityTint[option.value] ?? ''}`}>
                      {option.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="task-due-date">Due date</Label>
                <Input
                  id="task-due-date"
                  type="date"
                  value={form.formData.dueDate}
                  onChange={(event) => form.updateField('dueDate', event.target.value)}
                  disabled={form.isSubmitting}
                />
              </div>
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" type="button" className="w-full sm:w-auto" onClick={onClose} disabled={form.isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto" disabled={!form.canSubmit}>
                {form.isSubmitting && <Loader2 className="size-4 animate-spin" />}
                {editingTaskId ? 'Save changes' : 'Create task'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
