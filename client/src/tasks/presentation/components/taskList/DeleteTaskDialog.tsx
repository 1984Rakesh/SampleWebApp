import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui';

interface DeleteTaskDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteTaskDialog({ open, onCancel, onConfirm }: DeleteTaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onCancel(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete task</DialogTitle>
          <DialogDescription>Are you sure you want to delete this task? This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" type="button" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
