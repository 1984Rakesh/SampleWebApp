import Chip from '@mui/material/Chip';
import type { ChipProps } from '@mui/material/Chip';

interface UiChipProps extends Omit<ChipProps, 'color'> {
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
}

const toneColorMap: Record<NonNullable<UiChipProps['tone']>, ChipProps['color']> = {
  neutral: 'default',
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
};

export default function UiChip({ tone = 'neutral', ...props }: UiChipProps) {
  return <Chip color={toneColorMap[tone]} size="small" {...props} />;
}
