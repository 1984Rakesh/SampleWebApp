import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const displayFont = "'Bricolage Grotesque Variable', 'DM Sans', sans-serif";

interface UiDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md';
  children?: React.ReactNode;
}

export default function UiDialog({
  open,
  onClose,
  title,
  description,
  actions,
  maxWidth = 'xs',
  children,
}: UiDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={maxWidth}>
      <DialogTitle sx={{ fontFamily: displayFont, fontWeight: 700, fontSize: 28, letterSpacing: '-0.02em', lineHeight: 1.15 }}>{title}</DialogTitle>
      {description && (
        <DialogContent sx={{ pt: 0 }}>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
      )}
      {children && <DialogContent>{children}</DialogContent>}
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
}
