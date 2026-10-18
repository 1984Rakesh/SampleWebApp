import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import type { DialogProps } from '@mui/material/Dialog';

interface UiDialogProps extends Omit<DialogProps, 'children'> {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

export default function UiDialog({ title, description, actions, ...props }: UiDialogProps) {
  return (
    <Dialog {...props}>
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
