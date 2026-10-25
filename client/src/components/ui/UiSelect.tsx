import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Label } from './label';
import { cn } from './utils';
import type { SelectOption } from './SelectOption';

// Radix Select rejects empty-string item values; an empty option value (the
// "all" choice) travels through the widget as this sentinel instead.
const EMPTY_VALUE = '__ui_select_empty__';
const toInternal = (value: string) => (value === '' ? EMPTY_VALUE : value);
const fromInternal = (value: string) => (value === EMPTY_VALUE ? '' : value);

interface UiSelectProps {
  id?: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  hideLabel?: boolean;
  size?: 'sm' | 'md';
}

export default function UiSelect({
  id,
  label,
  value,
  options,
  onChange,
  disabled = false,
  error = false,
  helperText,
  hideLabel = false,
  size = 'md',
}: UiSelectProps) {
  const selectId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  const labelId = `${selectId}-label`;
  const helperId = helperText ? `${selectId}-helper` : undefined;

  return (
    <div className="grid w-full gap-1.5">
      <Label id={labelId} htmlFor={selectId} className={hideLabel ? 'sr-only' : undefined}>
        {label}
      </Label>
      <Select value={toInternal(value)} onValueChange={(next) => onChange(fromInternal(next))} disabled={disabled}>
        <SelectTrigger
          id={selectId}
          size={size === 'sm' ? 'sm' : 'default'}
          className="w-full"
          aria-labelledby={labelId}
          aria-invalid={error || undefined}
          aria-describedby={helperId}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value || EMPTY_VALUE} value={toInternal(option.value)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {helperText && (
        <p id={helperId} className={cn('text-sm', error ? 'text-destructive' : 'text-muted-foreground')}>
          {helperText}
        </p>
      )}
    </div>
  );
}
