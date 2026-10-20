// @ds Tabs v2026-10-20
import { cn } from '@/lib/utils';
import type { SelectOption } from './SelectOption';

// Rendered as a toggle group rather than tablist/tab: these options filter
// content rather than switching between tab panels, so aria-pressed buttons
// give correct semantics without dangling panel references.
interface UiTabsProps { value: string; options: SelectOption[]; onChange: (value: string) => void; ariaLabel: string; counts?: Record<string, number> }

export default function UiTabs({ value, options, onChange, ariaLabel, counts }: UiTabsProps) {
  return (
    <div role="group" aria-label={ariaLabel} className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-xl border bg-muted p-1">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
              selected && 'bg-background text-foreground shadow-sm',
            )}
          >
            {option.label}
            {counts && counts[option.value] !== undefined && (
              <span className="text-xs text-muted-foreground tabular-nums">{' '}{counts[option.value]}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
