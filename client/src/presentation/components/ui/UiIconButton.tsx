import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import UiIcon from './UiIcon';
import type { UiIconName } from './UiIcon';

interface UiIconButtonProps {
  icon: UiIconName;
  ariaLabel: string;
  onClick?: () => void;
  tone?: 'default' | 'success' | 'info' | 'danger';
  size?: 'sm' | 'md';
  tooltip?: string;
  hideFrom?: 'sm' | 'md' | 'lg';
  bordered?: boolean;
}

const toneMap = {
  default: 'default',
  success: 'success',
  info: 'info',
  danger: 'error',
} as const;

export default function UiIconButton({
  icon,
  ariaLabel,
  onClick,
  tone = 'default',
  size = 'md',
  tooltip,
  hideFrom,
  bordered = false,
}: UiIconButtonProps) {
  const button = (
    <IconButton
      size={size === 'sm' ? 'small' : 'medium'}
      color={toneMap[tone]}
      onClick={onClick}
      aria-label={ariaLabel}
      sx={{
        '&:hover': { bgcolor: 'action.hover' },
        ...(hideFrom && { display: { xs: 'inline-flex', [hideFrom]: 'none' } }),
        ...(bordered && { border: '1px solid', borderColor: tone === 'danger' ? 'rgba(255,158,140,0.3)' : 'divider', borderRadius: 1.5 }),
      }}
    >
      <UiIcon name={icon} size={size} />
    </IconButton>
  );

  return tooltip ? <Tooltip title={tooltip}>{button}</Tooltip> : button;
}
