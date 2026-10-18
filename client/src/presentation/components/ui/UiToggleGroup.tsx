import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import type { SelectOption } from '../../models/SelectOption';

interface UiToggleGroupProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  fullWidth?: boolean;
  gutterBottom?: boolean;
}

export default function UiToggleGroup({
  value,
  options,
  onChange,
  fullWidth = false,
  gutterBottom = false,
}: UiToggleGroupProps) {
  const handleChange = (_event: React.MouseEvent<HTMLElement>, next: string | null) => {
    if (next) {
      onChange(next);
    }
  };

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      fullWidth={fullWidth}
      onChange={handleChange}
      sx={gutterBottom ? { mb: 2 } : undefined}
    >
      {options.map((option) => (
        <ToggleButton key={option.value} value={option.value}>
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
