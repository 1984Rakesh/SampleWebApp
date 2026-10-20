import Checkbox from '@mui/material/Checkbox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

interface UiCheckboxProps {
  checked: boolean;
  ariaLabel: string;
  onChange: () => void;
  disabled?: boolean;
}

export default function UiCheckbox({ checked, ariaLabel, onChange, disabled = false }: UiCheckboxProps) {
  return (
    <Checkbox
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      aria-label={ariaLabel}
      icon={<RadioButtonUncheckedIcon />}
      checkedIcon={<CheckCircleIcon />}
      sx={{ p: 0.5, color: '#6B778E', '&.Mui-checked': { color: 'success.main' } }}
    />
  );
}
