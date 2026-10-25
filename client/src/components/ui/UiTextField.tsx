import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { cn } from './utils';

interface UiTextFieldProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'date';
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  multiline?: boolean;
  rows?: number;
  error?: boolean;
  helperText?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
  placeholder?: string;
}

export default function UiTextField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  disabled = false,
  autoComplete,
  multiline = false,
  rows,
  error = false,
  helperText,
  autoFocus = false,
  readOnly = false,
  placeholder,
}: UiTextFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  const helperId = helperText ? `${fieldId}-helper` : undefined;

  const shared = {
    id: fieldId,
    value,
    required,
    disabled,
    autoFocus,
    placeholder,
    'aria-invalid': error || undefined,
    'aria-describedby': helperId,
  };

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor={fieldId}>
        {label}
        {required && <span aria-hidden="true" className="text-destructive">*</span>}
      </Label>
      {multiline ? (
        <Textarea
          {...shared}
          rows={rows}
          readOnly={readOnly}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <Input
          {...shared}
          type={type}
          autoComplete={autoComplete}
          readOnly={readOnly}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {helperText && (
        <p id={helperId} className={cn('text-sm', error ? 'text-destructive' : 'text-muted-foreground')}>
          {helperText}
        </p>
      )}
    </div>
  );
}
