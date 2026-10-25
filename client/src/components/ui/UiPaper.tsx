import { cn } from './utils';

interface UiPaperProps {
  children: React.ReactNode;
  tone?: 'default' | 'dark';
  title?: string;
  action?: React.ReactNode;
}

export default function UiPaper({ children, tone = 'default', title, action }: UiPaperProps) {
  const dark = tone === 'dark';

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border bg-card',
        dark && 'border-border bg-muted text-foreground',
      )}
    >
      {title && (
        <div
          className={cn(
            'border-b border-border bg-accent px-4 py-2 text-sm font-medium text-muted-foreground',
          )}
        >
          {title}
        </div>
      )}
      <div className="relative">
        {action && <div className="absolute top-2 right-2">{action}</div>}
        {children}
      </div>
    </div>
  );
}
