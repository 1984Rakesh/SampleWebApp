import { cn } from './utils';

type Breakpoint = 'sm' | 'md' | 'lg';
type Display = 'block' | 'flex' | 'inline' | 'inline-flex';

interface UiResponsiveProps {
  children: React.ReactNode;
  hideBelow?: Breakpoint;
  hideFrom?: Breakpoint;
  display?: Display;
}

const displayMap: Record<Display, string> = {
  block: 'block',
  flex: 'flex',
  inline: 'inline',
  'inline-flex': 'inline-flex',
};

const hideBelowMap: Record<Breakpoint, Record<Display, string>> = {
  sm: { block: 'hidden sm:block', flex: 'hidden sm:flex', inline: 'hidden sm:inline', 'inline-flex': 'hidden sm:inline-flex' },
  md: { block: 'hidden md:block', flex: 'hidden md:flex', inline: 'hidden md:inline', 'inline-flex': 'hidden md:inline-flex' },
  lg: { block: 'hidden lg:block', flex: 'hidden lg:flex', inline: 'hidden lg:inline', 'inline-flex': 'hidden lg:inline-flex' },
};

const hideFromMap: Record<Breakpoint, string> = {
  sm: 'sm:hidden',
  md: 'md:hidden',
  lg: 'lg:hidden',
};

export default function UiResponsive({
  children,
  hideBelow,
  hideFrom,
  display = 'block',
}: UiResponsiveProps) {
  const className = hideBelow
    ? hideBelowMap[hideBelow][display]
    : cn(displayMap[display], hideFrom && hideFromMap[hideFrom]);

  return <div className={className}>{children}</div>;
}
