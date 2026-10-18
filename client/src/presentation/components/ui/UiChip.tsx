import Chip from '@mui/material/Chip';

export type UiChipTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

interface UiChipProps {
  label: string;
  tone?: UiChipTone;
  variant?: 'solid' | 'outline';
}

const toneStyles: Record<UiChipTone, { background: string; color: string }> = {
  neutral: { background: 'rgba(148, 163, 184, 0.12)', color: '#94A3B8' },
  info: { background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' },
  success: { background: 'rgba(52, 211, 153, 0.15)', color: '#34D399' },
  warning: { background: 'rgba(251, 146, 60, 0.15)', color: '#FB923C' },
  danger: { background: 'rgba(248, 113, 113, 0.15)', color: '#F87171' },
};

export default function UiChip({ label, tone = 'neutral', variant = 'solid' }: UiChipProps) {
  if (variant === 'outline') {
    return <Chip label={label} size="small" variant="outlined" />;
  }

  const colors = toneStyles[tone];

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        bgcolor: colors.background,
        color: colors.color,
        borderRadius: '16px',
        fontWeight: 500,
        fontSize: '0.75rem',
      }}
    />
  );
}
