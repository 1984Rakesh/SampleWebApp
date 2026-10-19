import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import UiIcon from './UiIcon';
import type { UiIconName } from './UiIcon';

interface UiIconButtonProps {
  icon: UiIconName;
  ariaLabel: string;
  onClick?: () => void;
  tone?: 'default' | 'primary' | 'success' | 'info' | 'danger';
  variant?: 'default' | 'solid';
  size?: 'sm' | 'md';
  tooltip?: string;
  hideFrom?: 'sm' | 'md' | 'lg';
  bordered?: boolean;
}

const toneMap = {
  default: 'default',
  primary: 'primary',
  success: 'success',
  info: 'info',
  danger: 'error',
} as const;

export default function UiIconButton({
  icon,
  ariaLabel,
  onClick,
  tone = 'default',
  variant = 'default',
  size = 'md',
  tooltip,
  hideFrom,
  bordered = false,
}: UiIconButtonProps) {
  const solidSx = variant === 'solid' ? {
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    '&:hover': { bgcolor: 'primary.dark' },
    borderRadius: '50%',
    width: 40,
    height: 40,
  } : {};

  const button = (
    <IconButton
      size={size === 'sm' ? 'small' : 'medium'}
      color={variant === 'solid' ? undefined : toneMap[tone]}
      onClick={onClick}
      aria-label={ariaLabel}
      sx={{
        ...(variant !== 'solid' && { '&:hover': { bgcolor: 'action.hover' } }),
        ...(hideFrom && { display: { xs: 'inline-flex', [hideFrom]: 'none' } }),
        ...(bordered && { border: '1px solid', borderColor: tone === 'danger' ? 'rgba(255,158,140,0.3)' : 'divider', borderRadius: 1.5 }),
        ...solidSx,
      }}
    >
      <UiIcon name={icon} size={size} />
    </IconButton>
  );

  return tooltip ? <Tooltip title={tooltip}>{button}</Tooltip> : button;
}
