import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const sizeClassMap: Record<NonNullable<LoadingSpinnerProps['size']>, string> = {
  sm: 'size-4',
  md: 'size-8',
  lg: 'size-12',
};

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-4">
      <Loader2 className={`${sizeClassMap[size]} animate-spin text-primary motion-reduce:animate-none`} aria-hidden="true" />
      {text ? <p className="text-muted-foreground">{text}</p> : <span className="sr-only">Loading</span>}
    </div>
  );
}
