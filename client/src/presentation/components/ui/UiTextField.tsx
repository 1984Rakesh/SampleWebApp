import TextField from '@mui/material/TextField';

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
  return (
    <TextField
      fullWidth
      variant="outlined"
      id={id}
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      type={type}
      required={required}
      disabled={disabled}
      autoComplete={autoComplete}
      multiline={multiline}
      rows={rows}
      error={error}
      helperText={helperText}
      autoFocus={autoFocus}
      placeholder={placeholder}
      slotProps={{ input: { readOnly }, inputLabel: type === 'date' ? { shrink: true } : undefined }}
    />
  );
}
