import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import type { SxProps, Theme } from '@mui/material/styles';

type UiButtonVariant = 'solid' | 'outline' | 'text';
type UiButtonTone = 'primary' | 'danger' | 'muted';
type UiButtonSize = 'sm' | 'md';
type Breakpoint = 'sm' | 'md' | 'lg';

const variantMap: Record<UiButtonVariant, 'contained' | 'outlined' | 'text'> = {
  solid: 'contained',
  outline: 'outlined',
  text: 'text',
};

const toneMap: Record<UiButtonTone, 'primary' | 'error' | 'inherit'> = {
  primary: 'primary',
  danger: 'error',
  muted: 'inherit',
};

interface UiButtonProps {
  children: React.ReactNode;
  variant?: UiButtonVariant;
  tone?: UiButtonTone;
  size?: UiButtonSize;
  fullWidth?: boolean;
  fullWidthBelow?: Breakpoint;
  minWidth?: number;
  noShrink?: boolean;
  type?: 'button' | 'submit';
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  to?: string;
  startIcon?: React.ReactNode;
}

export default function UiButton({
  children,
  variant = 'text',
  tone = 'primary',
  size = 'md',
  fullWidth = false,
  fullWidthBelow,
  minWidth,
  noShrink = false,
  type,
  disabled,
  isLoading = false,
  onClick,
  ariaLabel,
  to,
  startIcon,
}: UiButtonProps) {
  const sx: SxProps<Theme> = {
    textTransform: 'none',
    fontWeight: 500,
    ...(minWidth !== undefined && { minWidth }),
    ...(noShrink && { flexShrink: 0 }),
    ...(fullWidthBelow && {
      width: { xs: '100%', [fullWidthBelow]: 'auto' },
    }),
    ...(tone === 'muted' && {
      bgcolor: 'grey.700',
      color: 'grey.300',
      '&:hover': { bgcolor: 'grey.600' },
    }),
  };

  return (
    <Button
      variant={variantMap[variant]}
      color={tone === 'muted' ? 'inherit' : toneMap[tone]}
      size={size === 'sm' ? 'small' : 'medium'}
      fullWidth={fullWidth}
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      aria-label={ariaLabel}
      startIcon={startIcon}
      sx={sx}
      {...(to ? { component: RouterLink, to } : {})}
    >
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
