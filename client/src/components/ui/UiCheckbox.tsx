import { Checkbox } from './checkbox';

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
      onCheckedChange={onChange}
      disabled={disabled}
      aria-label={ariaLabel}
      className="size-5 rounded-full data-[state=checked]:border-success data-[state=checked]:bg-success data-[state=checked]:text-background dark:data-[state=checked]:bg-success"
    />
  );
}
