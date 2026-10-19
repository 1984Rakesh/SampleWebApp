import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import UiIcon from './UiIcon';
import type { UiIconName } from './UiIcon';

interface UiAvatarProps {
  src?: string;
  label?: string;
  icon?: UiIconName;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'primary' | 'success' | 'info' | 'muted';
  variant?: 'soft' | 'solid';
  shape?: 'circle' | 'square';
  tooltip?: string;
  alt?: string;
}

const sizeMap = { sm: 32, md: 40, lg: 88 } as const;
const fontSizeMap = { sm: '0.875rem', md: '1.25rem', lg: '2rem' } as const;

const softToneMap = {
  primary: { bgcolor: 'primary.light', color: 'primary.dark' },
  success: { bgcolor: 'success.light', color: 'success.dark' },
  info: { bgcolor: 'info.light', color: 'info.dark' },
  muted: { bgcolor: 'action.selected', color: 'text.secondary' },
} as const;

const solidToneMap = {
  primary: { bgcolor: 'primary.main', color: 'primary.contrastText' },
  success: { bgcolor: 'success.main', color: 'success.contrastText' },
  info: { bgcolor: 'info.main', color: 'info.contrastText' },
  muted: { bgcolor: 'action.selected', color: 'text.secondary' },
} as const;

export default function UiAvatar({
  src,
  label,
  icon,
  size = 'md',
  tone = 'primary',
  variant = 'soft',
  shape = 'circle',
  tooltip,
  alt,
}: UiAvatarProps) {
  const toneSx = variant === 'solid' ? solidToneMap[tone] : softToneMap[tone];
  const dimension = sizeMap[size];

  const avatar = (
    <Avatar
      src={src}
      alt={alt ?? label}
      variant={shape === 'square' ? 'rounded' : 'circular'}
      sx={{ width: dimension, height: dimension, fontSize: fontSizeMap[size], ...toneSx, ...(shape === 'square' && { borderRadius: '10px' }) }}
    >
      {icon ? <UiIcon name={icon} /> : label}
    </Avatar>
  );

  return tooltip ? <Tooltip title={tooltip}>{avatar}</Tooltip> : avatar;
}
