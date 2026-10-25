import { Link as RouterLink } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from './button';
import { cn } from './utils';

type UiButtonVariant = 'solid' | 'outline' | 'text' | 'link';
type UiButtonTone = 'primary' | 'danger' | 'muted';
type UiButtonSize = 'sm' | 'md';
type Breakpoint = 'sm' | 'md' | 'lg';

const variantMap = {
  solid: 'default',
  outline: 'outline',
  text: 'ghost',
  link: 'link',
} as const;

const fullWidthBelowMap: Record<Breakpoint, string> = {
  sm: 'w-full sm:w-auto',
  md: 'w-full md:w-auto',
  lg: 'w-full lg:w-auto',
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
  endIcon?: React.ReactNode;
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
  endIcon,
}: UiButtonProps) {
  const destructive = tone === 'danger';
  const buttonVariant = variant === 'solid' && destructive ? 'destructive' : variantMap[variant];

  const className = cn(
    'font-medium',
    noShrink && 'shrink-0',
    fullWidth && 'w-full',
    fullWidthBelow && fullWidthBelowMap[fullWidthBelow],
    destructive && variant !== 'solid' && cn(
      'text-destructive hover:text-destructive',
      variant === 'outline' && 'border-destructive hover:bg-destructive/10',
    ),
    tone === 'muted' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    variant === 'link' && 'h-auto px-0',
  );

  const content = isLoading ? (
    <>
      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      {children}
    </>
  ) : (
    <>
      {startIcon}
      {children}
      {endIcon}
    </>
  );

  if (to) {
    if (disabled || isLoading) {
      return (
        <Button
          variant={buttonVariant}
          size={size === 'sm' ? 'sm' : 'default'}
          type="button"
          disabled
          aria-label={ariaLabel}
          style={minWidth !== undefined ? { minWidth } : undefined}
          className={className}
        >
          {content}
        </Button>
      );
    }
    return (
      <Button
        asChild
        variant={buttonVariant}
        size={size === 'sm' ? 'sm' : 'default'}
        aria-label={ariaLabel}
        style={minWidth !== undefined ? { minWidth } : undefined}
        className={className}
      >
        <RouterLink to={to} onClick={onClick}>{content}</RouterLink>
      </Button>
    );
  }

  return (
    <Button
      variant={buttonVariant}
      size={size === 'sm' ? 'sm' : 'default'}
      type={type ?? 'button'}
      disabled={disabled || isLoading}
      onClick={onClick}
      aria-label={ariaLabel}
      style={minWidth !== undefined ? { minWidth } : undefined}
      className={className}
    >
      {content}
    </Button>
  );
}
