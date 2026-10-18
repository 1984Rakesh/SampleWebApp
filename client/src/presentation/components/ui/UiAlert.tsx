import Alert from '@mui/material/Alert';

interface UiAlertProps {
  type?: 'error' | 'success' | 'info' | 'warning';
  gutterBottom?: boolean;
  children: React.ReactNode;
}

export default function UiAlert({ type = 'info', gutterBottom = false, children }: UiAlertProps) {
  return (
    <Alert severity={type} sx={gutterBottom ? { mb: 2 } : undefined}>
      {children}
    </Alert>
  );
}
