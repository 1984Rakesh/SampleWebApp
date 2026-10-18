import Alert from '@mui/material/Alert';
import type { AlertProps } from '@mui/material/Alert';

interface UiAlertProps extends AlertProps {
  children: React.ReactNode;
}

export default function UiAlert({ children, ...props }: UiAlertProps) {
  return <Alert {...props}>{children}</Alert>;
}
