import { UiSnackbar } from './ui';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  return <UiSnackbar open message={message} type={type} onClose={onClose} autoHideDuration={duration} />;
}
