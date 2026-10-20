import { cn } from '@/lib/utils';
import type { SelectOption } from './SelectOption';

interface UiToggleGroupProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  fullWidth?: boolean;
  gutterBottom?: boolean;
  disabledValues?: string[];
  ariaLabel?: string;
}

export default function UiToggleGroup({
  value,
  options,
  onChange,
  fullWidth = false,
  gutterBottom = false,
  disabledValues = [],
  ariaLabel,
}: UiToggleGroupProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center gap-1 rounded-xl border bg-muted p-1',
        fullWidth && 'flex w-full',
        gutterBottom && 'mb-4',
      )}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            disabled={disabledValues.includes(option.value)}
            onClick={() => {
              if (!selected) onChange(option.value);
            }}
            className={cn(
              'rounded-lg px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
              fullWidth && 'flex-1',
              selected && 'bg-background text-foreground shadow-sm',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
