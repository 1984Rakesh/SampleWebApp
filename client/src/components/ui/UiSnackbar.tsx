import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

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
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const close = () => onCloseRef.current();
    const id = toast[type](message, {
      duration: autoHideDuration,
      onDismiss: close,
      onAutoClose: close,
    });
    return () => {
      toast.dismiss(id);
    };
  }, [open, message, type, autoHideDuration]);

  return null;
}
