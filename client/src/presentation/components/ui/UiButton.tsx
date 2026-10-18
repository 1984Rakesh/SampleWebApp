import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import type { ButtonProps } from '@mui/material/Button';

interface UiButtonProps extends Omit<ButtonProps, 'children'> {
  children: React.ReactNode;
  isLoading?: boolean;
}

export default function UiButton({
  children,
  isLoading = false,
  disabled,
  ...props
}: UiButtonProps) {
  return (
    <Button disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <>
          <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
          {children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
