import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import UiIcon from './UiIcon';
import type { UiIconName } from './UiIcon';
import { cn } from '@/lib/utils';

interface UiIconButtonProps {
  icon: UiIconName;
  ariaLabel: string;
  onClick?: () => void;
  tone?: 'default' | 'primary' | 'success' | 'info' | 'danger';
  variant?: 'default' | 'solid';
  size?: 'sm' | 'md';
  tooltip?: string;
  hideFrom?: 'sm' | 'md' | 'lg';
  bordered?: boolean;
  destructiveHover?: boolean;
}

const toneClassMap = {
  default: 'text-muted-foreground hover:bg-accent',
  primary: 'text-primary hover:bg-accent',
  success: 'text-success hover:bg-accent',
  info: 'text-status-progress-foreground hover:bg-accent',
  danger: 'text-destructive hover:bg-accent',
} as const;

const hideFromClassMap = {
  sm: 'sm:hidden',
  md: 'md:hidden',
  lg: 'lg:hidden',
} as const;

export default function UiIconButton({
  icon,
  ariaLabel,
  onClick,
  tone = 'default',
  variant = 'default',
  size = 'md',
  tooltip,
  hideFrom,
  bordered = false,
  destructiveHover = false,
}: UiIconButtonProps) {
  const button = (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center justify-center rounded-full outline-none transition-colors',
        'focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50',
        size === 'sm' ? 'size-8' : 'size-10',
        variant === 'solid'
          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
          : toneClassMap[tone],
        bordered && cn('border rounded-md', tone === 'danger' ? 'border-destructive/30' : 'border-border'),
        destructiveHover && 'hover:text-destructive',
        hideFrom && hideFromClassMap[hideFrom],
      )}
    >
      <UiIcon name={icon} size={size} />
    </button>
  );

  if (!tooltip) return button;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
