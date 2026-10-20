import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';

interface UiFlexProps {
  children?: React.ReactNode;
  column?: boolean;
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'space-between';
  gap?: number;
  wrap?: boolean;
  grow?: boolean;
  flex?: number;
  minWidth0?: boolean;
  centered?: boolean;
  dividerTop?: boolean;
  rounded?: boolean;
  bgColor?: string;
  p?: number;
  px?: number;
  py?: number;
  pt?: number;
  mt?: number | 'auto';
  mb?: number;
  ml?: number;
  mr?: number | 'auto';
  textAlign?: 'center';
  role?: string;
  ariaLabel?: string;
}

const alignMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
} as const;

const justifyMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  'space-between': 'space-between',
} as const;

export default function UiFlex({
  children,
  column = false,
  align,
  justify,
  gap,
  wrap = false,
  grow = false,
  flex,
  minWidth0 = false,
  centered = false,
  dividerTop = false,
  rounded = false,
  bgColor,
  p,
  px,
  py,
  pt,
  mt,
  mb,
  ml,
  mr,
  textAlign,
  role,
  ariaLabel,
}: UiFlexProps) {
  const sx: SxProps<Theme> = {
    display: 'flex',
    ...(column && { flexDirection: 'column' }),
    ...(align && { alignItems: alignMap[align] }),
    ...(justify && { justifyContent: justifyMap[justify] }),
    ...(gap !== undefined && { gap }),
    ...(wrap && { flexWrap: 'wrap' }),
    ...(grow && { flexGrow: 1 }),
    ...(flex !== undefined && { flex }),
    ...(minWidth0 && { minWidth: 0 }),
    ...(centered && { minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }),
    ...(dividerTop && { mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }),
    ...(rounded && { borderRadius: 1 }),
    ...(bgColor && { bgcolor: bgColor }),
    ...(p !== undefined && { p }),
    ...(px !== undefined && { px }),
    ...(py !== undefined && { py }),
    ...(pt !== undefined && { pt }),
    ...(mt !== undefined && { mt }),
    ...(mb !== undefined && { mb }),
    ...(ml !== undefined && { ml }),
    ...(mr !== undefined && { mr }),
    ...(textAlign && { textAlign }),
  };

  return (
    <Box sx={sx} role={role} aria-label={ariaLabel}>
      {children}
    </Box>
  );
}
