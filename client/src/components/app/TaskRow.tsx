// @ds TaskRow v2026-10-20
import { cn } from '@/lib/utils';
import UiCheckbox from '../ui/UiCheckbox';
import UiChip from '../ui/UiChip';
import type { UiChipTone } from '../ui/UiChip';

// Task list row for cards: round checkbox, title, description, status/priority
// chips, due date. Mirrors design-system components/app/TaskRow.jsx.
export interface TaskRowProps {
  title: string;
  description?: string;
  isCompleted: boolean;
  toggleAriaLabel: string;
  statusLabel: string;
  statusTone: UiChipTone;
  priorityLabel: string;
  priorityTone: UiChipTone;
  dueDateLabel?: string;
  dueDateTone?: 'amber' | 'muted' | 'default';
  divider?: boolean;
  onToggle: () => void;
}

export function TaskRow({
  title,
  description,
  isCompleted,
  toggleAriaLabel,
  statusLabel,
  statusTone,
  priorityLabel,
  priorityTone,
  dueDateLabel,
  dueDateTone = 'muted',
  divider = false,
  onToggle,
}: TaskRowProps) {
  return (
    <div data-slot="task-row" className={cn('flex items-start gap-3 px-6 py-4', divider && 'border-t')}>
      <div className="mt-0.5">
        <UiCheckbox checked={isCompleted} ariaLabel={toggleAriaLabel} onChange={onToggle} />
      </div>
      <div className="min-w-0 flex-1">
        <div className={cn('text-sm font-medium', isCompleted && 'text-muted-foreground line-through')}>{title}</div>
        {description ? <div className="text-muted-foreground mt-0.5 text-sm">{description}</div> : null}
        <div className="mt-2 flex gap-1.5">
          <UiChip label={statusLabel} tone={statusTone} />
          <UiChip label={`• ${priorityLabel}`} tone={priorityTone} />
        </div>
      </div>
      {dueDateLabel ? (
        <div className={cn('text-sm tabular-nums leading-6 whitespace-nowrap', dueDateTone === 'amber' && !isCompleted ? 'text-warning font-medium' : 'text-muted-foreground')}>
          {dueDateLabel}
        </div>
      ) : null}
    </div>
  );
}
