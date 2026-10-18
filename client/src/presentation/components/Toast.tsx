import { useEffect } from 'react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-400',
  };

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-3 rounded-md shadow-lg border ${typeStyles[type]} animate-slide-up z-50`}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-sm font-medium hover:opacity-75"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}
