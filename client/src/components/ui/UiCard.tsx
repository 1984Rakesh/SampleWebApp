import { Link as RouterLink } from 'react-router-dom';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { cn } from './utils';

interface UiCardProps {
  children: React.ReactNode;
  maxWidth?: number;
  spaced?: boolean;
  flush?: boolean;
  to?: string;
}

export function UiCard({ children, maxWidth, spaced = false, flush = false, to }: UiCardProps) {
  const content = to ? (
    <RouterLink
      to={to}
      className="flex h-full flex-col gap-6 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
    </RouterLink>
  ) : (
    children
  );

  return (
    <Card
      className={cn(spaced && 'mb-6', flush && 'gap-0 py-0 overflow-hidden', to && 'transition-colors hover:bg-accent/40')}
      style={maxWidth !== undefined ? { maxWidth, width: '100%' } : undefined}
    >
      {content}
    </Card>
  );
}

interface UiCardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  centered?: boolean;
  compact?: boolean;
}

export function UiCardHeader({ title, subtitle, action, centered = false, compact = false }: UiCardHeaderProps) {
  return (
    <CardHeader className={cn(centered && 'text-center', compact && 'items-center pt-5 pb-3')}>
      <CardTitle className={centered ? 'text-2xl' : undefined}>{title}</CardTitle>
      {subtitle && <CardDescription>{subtitle}</CardDescription>}
      {action && <CardAction>{action}</CardAction>}
    </CardHeader>
  );
}

interface UiCardContentProps {
  children: React.ReactNode;
  compact?: boolean;
}

export function UiCardContent({ children, compact = false }: UiCardContentProps) {
  return <CardContent className={compact ? 'px-4 sm:px-5' : undefined}>{children}</CardContent>;
}

interface UiCardFooterProps {
  children: React.ReactNode;
  centered?: boolean;
  end?: boolean;
  divided?: boolean;
}

export function UiCardFooter({ children, centered = false, end = false, divided = false }: UiCardFooterProps) {
  return (
    <CardFooter
      className={cn(
        centered && 'justify-center gap-1 text-sm',
        end && 'justify-end gap-2',
        divided && 'border-t',
      )}
    >
      {children}
    </CardFooter>
  );
}
