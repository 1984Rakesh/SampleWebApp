import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import UiIcon from './UiIcon';
import type { UiIconName } from './UiIcon';
import { cn } from '@/lib/utils';

interface UiAvatarProps {
  src?: string;
  label?: string;
  icon?: UiIconName;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'primary' | 'success' | 'info' | 'muted';
  variant?: 'soft' | 'solid';
  shape?: 'circle' | 'square';
  tooltip?: string;
  alt?: string;
}

const sizeClassMap = {
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-20',
} as const;

const fontSizeClassMap = {
  sm: 'text-sm',
  md: 'text-xl',
  lg: 'text-3xl',
} as const;

const softToneClassMap = {
  primary: 'bg-primary/15 text-primary',
  success: 'bg-status-done text-status-done-foreground',
  info: 'bg-status-progress text-status-progress-foreground',
  muted: 'bg-secondary text-muted-foreground',
} as const;

const solidToneClassMap = {
  primary: 'bg-primary text-primary-foreground',
  success: 'bg-success text-white',
  info: 'bg-status-progress-foreground text-white',
  muted: 'bg-secondary text-muted-foreground',
} as const;

export default function UiAvatar({
  src,
  label,
  icon,
  size = 'md',
  tone = 'primary',
  variant = 'soft',
  shape = 'circle',
  tooltip,
  alt,
}: UiAvatarProps) {
  const toneClass = variant === 'solid' ? solidToneClassMap[tone] : softToneClassMap[tone];

  const avatar = (
    <Avatar className={cn(sizeClassMap[size], shape === 'square' && 'rounded-[10px]')}>
      {src && <AvatarImage src={src} alt={alt ?? label} />}
      <AvatarFallback className={cn(toneClass, fontSizeClassMap[size], label && 'font-heading font-semibold', shape === 'square' && 'rounded-[10px]')}>
        {icon ? <UiIcon name={icon} /> : label}
      </AvatarFallback>
    </Avatar>
  );

  if (!tooltip) return avatar;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{avatar}</TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
