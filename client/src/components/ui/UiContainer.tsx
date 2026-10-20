import { cn } from '@/lib/utils';

interface UiContainerProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '5xl' | '6xl';
  disableGutters?: boolean;
  children: React.ReactNode;
}

const maxWidthClassMap = {
  sm: 'max-w-[600px]',
  md: 'max-w-[900px]',
  lg: 'max-w-[1200px]',
  xl: 'max-w-[1536px]',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
} as const;

export default function UiContainer({
  maxWidth = 'lg',
  disableGutters = false,
  children,
}: UiContainerProps) {
  return (
    <div className={cn('mx-auto w-full', maxWidthClassMap[maxWidth], !disableGutters && 'px-4')}>
      {children}
    </div>
  );
}
