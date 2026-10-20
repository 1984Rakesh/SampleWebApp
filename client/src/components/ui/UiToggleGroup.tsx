import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import type { SelectOption } from './SelectOption';

interface UiToggleGroupProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  fullWidth?: boolean;
  gutterBottom?: boolean;
  disabledValues?: string[];
}

export default function UiToggleGroup({
  value,
  options,
  onChange,
  fullWidth = false,
  gutterBottom = false,
  disabledValues = [],
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
      sx={(theme) => {
        const dark = theme.palette.mode === 'dark';
        return {
          ...(gutterBottom && { mb: 2 }),
          borderRadius: '12px',
          border: `1px solid ${dark ? '#232A37' : '#D9DDE7'}`,
          bgcolor: dark ? '#0D1118' : '#F0F2F7',
          p: '4px',
          gap: 0,
          '& .MuiToggleButtonGroup-grouped': {
            border: 'none',
            borderRadius: '9px !important',
            fontSize: 14,
            fontWeight: 500,
            textTransform: 'none',
            px: 2,
            py: 0.75,
            color: dark ? '#98A2B5' : '#5B6577',
            '&.Mui-selected': {
              bgcolor: dark ? '#232B3B' : '#FFFFFF',
              color: dark ? '#ECEFF5' : '#141824',
              boxShadow: dark ? 'none' : '0 1px 2px rgba(20,24,36,0.08), 0 0 0 1px rgba(20,24,36,0.04)',
            },
            '&.Mui-selected:hover': {
              bgcolor: dark ? '#232B3B' : '#FFFFFF',
            },
          },
        };
      }}
    >
      {options.map((option) => (
        <ToggleButton key={option.value} value={option.value} disabled={disabledValues.includes(option.value)}>
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
