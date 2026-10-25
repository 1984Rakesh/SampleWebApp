// @ds TaskRow v2026-10-20
import { cn } from '../ui';
import UiCheckbox from '../ui/UiCheckbox';
import UiChip from '../ui/UiChip';
import type { UiChipTone } from '../ui/UiChip';

// ChecklistRow is the feature-neutral version of the DS TaskRow block: round
// checkbox, title, optional description, chips and trailing meta text.
// Mirrors design-system components/app/TaskRow.jsx.
export interface ChecklistRowChip {
  label: string;
  tone: UiChipTone;
}

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
    <div data-slot="task-row" className={cn('flex items-start gap-3 px-6 py-4', divider && 'border-t')}>
      <div className="mt-0.5">
        <UiCheckbox checked={checked} ariaLabel={toggleAriaLabel} onChange={onToggle} />
      </div>
      <div className="min-w-0 flex-1">
        <div className={cn('text-sm font-medium', checked && 'text-muted-foreground line-through')}>{title}</div>
        {description ? <div className="text-muted-foreground mt-0.5 text-sm">{description}</div> : null}
        <div className="mt-2 flex gap-1.5">
          {chips.map((chip, index) => <UiChip key={index} label={chip.label} tone={chip.tone} />)}
        </div>
      </div>
      {meta ? (
        <div className={cn('text-sm tabular-nums leading-6 whitespace-nowrap', metaTone === 'warning' && !checked ? 'text-warning font-medium' : 'text-muted-foreground')}>
          {meta}
        </div>
      ) : null}
    </div>
  );
}
