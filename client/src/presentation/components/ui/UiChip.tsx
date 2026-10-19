import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import { chipColorsByMode, type ChipTone } from '../../../foundation/theme/theme';

export type UiChipTone = ChipTone;

interface UiChipProps {
  label: string;
  tone?: UiChipTone;
  variant?: 'solid' | 'outline';
}

export default function UiChip({ label, tone = 'neutral', variant = 'solid' }: UiChipProps) {
  const theme = useTheme();
  if (variant === 'outline') {
    return <Chip label={label} size="small" variant="outlined" />;
  }

  const mode = theme.palette.mode === 'dark' ? 'dark' : 'light';
  const colors = chipColorsByMode[mode][tone];

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        bgcolor: colors.bg,
        color: colors.fg,
        borderRadius: '16px',
        fontWeight: 500,
        fontSize: '0.75rem',
      }}
    />
  );
}
