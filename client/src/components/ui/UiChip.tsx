// @ds TaskBadge v2026-10-20
import { Badge } from './badge';
import { cn } from './utils';

export type UiChipTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

const toneClassMap: Record<UiChipTone, string> = {
  neutral: 'bg-status-todo text-status-todo-foreground',
  info: 'bg-status-progress text-status-progress-foreground',
  success: 'bg-status-done text-status-done-foreground',
  warning: 'bg-priority-medium text-priority-medium-foreground',
  danger: 'bg-priority-high text-priority-high-foreground',
};

interface UiChipProps {
  label: string;
  tone?: UiChipTone;
  variant?: 'solid' | 'outline';
}

export default function UiChip({ label, tone = 'neutral', variant = 'solid' }: UiChipProps) {
  if (variant === 'outline') {
    return <Badge variant="outline">{label}</Badge>;
  }

  return (
    <Badge variant="secondary" className={cn('border-transparent', toneClassMap[tone])}>
      {label}
    </Badge>
  );
}
