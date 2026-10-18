import { UiButton, UiDialog } from '../ui';

interface DeleteTaskDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteTaskDialog({ open, onCancel, onConfirm }: DeleteTaskDialogProps) {
  return (
    <UiDialog
      open={open}
      onClose={onCancel}
      title="Delete Task"
      description="Are you sure you want to delete this task? This action cannot be undone."
      actions={
        <>
          <UiButton onClick={onCancel}>Cancel</UiButton>
          <UiButton onClick={onConfirm} tone="danger" variant="solid">
            Delete
          </UiButton>
        </>
      }
    />
  );
}
