import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface UiSnackbarProps {
  open: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  autoHideDuration?: number;
}

export default function UiSnackbar({
  open,
  message,
  type = 'info',
  onClose,
  autoHideDuration = 3000,
}: UiSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert severity={type} variant="filled" onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
}
