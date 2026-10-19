import { Link as RouterLink } from 'react-router-dom';
import Typography from '@mui/material/Typography';

type UiTextVariant = 'h1' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption';
type UiTextTone = 'default' | 'muted' | 'accent' | 'danger' | 'amber' | 'light' | 'lightMuted';
type UiTextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

interface UiTextProps {
  children: React.ReactNode;
  variant?: UiTextVariant;
  tone?: UiTextTone;
  weight?: UiTextWeight;
  align?: 'center' | 'left' | 'right';
  gutterBottom?: boolean;
  noWrap?: boolean;
  breakWord?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'li';
  to?: string;
  maxWidth?: number;
  mt?: number;
  mb?: number;
  strike?: boolean;
}

const toneMap: Record<UiTextTone, string> = {
  default: 'text.primary',
  muted: 'text.secondary',
  accent: 'primary.main',
  danger: 'error.main',
  amber: 'warning.main',
  light: '#fff',
  lightMuted: 'rgba(255,255,255,0.9)',
};

const weightMap: Record<UiTextWeight, number> = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

export default function UiText({
  children,
  variant = 'body1',
  tone = 'default',
  weight,
  align,
  gutterBottom = false,
  noWrap = false,
  breakWord = false,
  as,
  to,
  maxWidth,
  mt,
  mb,
  strike = false,
}: UiTextProps) {
  const shared = {
    variant,
    color: toneMap[tone],
    fontWeight: weight ? weightMap[weight] : undefined,
    textAlign: align,
    gutterBottom,
    noWrap,
    maxWidth,
    mt,
    mb,
    sx: {
      ...(to && { textDecoration: 'none' }),
      ...(breakWord && { minWidth: 0, overflowWrap: 'anywhere' }),
      ...(strike && { textDecoration: 'line-through' }),
    },
  } as const;

  if (to) {
    return (
      <Typography {...shared} component={RouterLink} to={to}>
        {children}
      </Typography>
    );
  }

  return (
    <Typography {...shared} {...(as ? { component: as } : {})}>
      {children}
    </Typography>
  );
}
