import Box from '@mui/material/Box';

type Breakpoint = 'sm' | 'md' | 'lg';
type Display = 'block' | 'flex' | 'inline' | 'inline-flex';

interface UiResponsiveProps {
  children: React.ReactNode;
  hideBelow?: Breakpoint;
  hideFrom?: Breakpoint;
  display?: Display;
}

export default function UiResponsive({
  children,
  hideBelow,
  hideFrom,
  display = 'block',
}: UiResponsiveProps) {
  const displaySx = hideBelow
    ? { xs: 'none', [hideBelow]: display }
    : hideFrom
      ? { xs: display, [hideFrom]: 'none' }
      : display;

  return <Box sx={{ display: displaySx }}>{children}</Box>;
}
