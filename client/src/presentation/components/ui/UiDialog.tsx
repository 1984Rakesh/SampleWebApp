import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface UiDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md';
}

export default function UiDialog({
  open,
  onClose,
  title,
  description,
  actions,
  maxWidth = 'xs',
}: UiDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={maxWidth}>
      <DialogTitle>{title}</DialogTitle>
      {description && (
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
      )}
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
}
