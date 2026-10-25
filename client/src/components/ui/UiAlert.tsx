import { CircleCheck, Info, OctagonX, TriangleAlert } from 'lucide-react';
import { Alert, AlertDescription } from './alert';
import { cn } from './utils';

type UiAlertType = 'error' | 'success' | 'info' | 'warning';

const iconMap: Record<UiAlertType, typeof Info> = {
  error: OctagonX,
  success: CircleCheck,
  info: Info,
  warning: TriangleAlert,
};

const toneClassMap: Partial<Record<UiAlertType, string>> = {
  success: 'border-success/50 [&>svg]:text-success',
  warning: 'border-warning/50 [&>svg]:text-warning',
};

interface UiAlertProps {
  type?: UiAlertType;
  gutterBottom?: boolean;
  children: React.ReactNode;
}

export default function UiAlert({ type = 'info', gutterBottom = false, children }: UiAlertProps) {
  const Icon = iconMap[type];

  return (
    <Alert
      variant={type === 'error' ? 'destructive' : 'default'}
      className={cn(toneClassMap[type], gutterBottom && 'mb-4')}
    >
      <Icon />
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
