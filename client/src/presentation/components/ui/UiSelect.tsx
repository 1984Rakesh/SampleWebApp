import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { SelectOption } from '../../models/SelectOption';

interface UiSelectProps {
  id?: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
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
  size = 'md',
}: UiSelectProps) {
  const selectId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  const labelId = `${selectId}-label`;

  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth error={error} disabled={disabled} size={size === 'sm' ? 'small' : 'medium'}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        id={selectId}
        value={value}
        label={label}
        onChange={handleChange}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
