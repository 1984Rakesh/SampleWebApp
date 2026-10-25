// @ds TaskRow v2026-10-20
import { Badge, Checkbox, cn } from '../ui';

// ChecklistRow is the feature-neutral version of the DS TaskRow block: round
// checkbox, title, optional description, chips and trailing meta text.
// Mirrors design-system components/app/TaskRow.jsx.
export type ChecklistRowChipTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface ChecklistRowChip {
  label: string;
  tone: ChecklistRowChipTone;
}

const chipVariants = {
  neutral: 'status-todo',
  info: 'status-progress',
  success: 'status-done',
  warning: 'priority-medium',
  danger: 'priority-high',
} as const;

export type ChecklistRowMetaTone = 'warning' | 'muted';

export interface ChecklistRowProps {
  title: string;
  description?: string;
  checked: boolean;
  toggleAriaLabel: string;
  chips: ChecklistRowChip[];
  meta?: string;
  metaTone?: ChecklistRowMetaTone;
  divider?: boolean;
  onToggle: () => void;
}

export function ChecklistRow({
  title,
  description,
  checked,
  toggleAriaLabel,
  chips,
  meta,
  metaTone = 'muted',
  divider = false,
  onToggle,
}: ChecklistRowProps) {
  return (
    <div data-slot="task-row" className={cn('flex items-start gap-4 bg-card px-6 py-[18px] text-card-foreground', divider && 'border-t border-divider')}>
      <div className="mt-0.5">
        <Checkbox checked={checked} aria-label={toggleAriaLabel} onCheckedChange={onToggle} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className={cn('text-base leading-[22px] font-semibold', checked && 'text-muted-foreground line-through')}>{title}</div>
        {description ? <div className="text-sm leading-5 text-muted-foreground">{description}</div> : null}
        <div className="mt-2 flex flex-wrap gap-2">
          {chips.map((chip, index) => <Badge key={index} variant={chipVariants[chip.tone]}>{chip.label}</Badge>)}
        </div>
      </div>
      {meta ? (
        <div className={cn('mt-0.5 shrink-0 text-[13px] leading-[18px] font-medium whitespace-nowrap tabular-nums', metaTone === 'warning' && !checked ? 'text-warning' : 'text-muted-foreground')}>
          {meta}
        </div>
      ) : null}
    </div>
  );
}
