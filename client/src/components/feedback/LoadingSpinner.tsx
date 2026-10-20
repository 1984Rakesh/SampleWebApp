import { UiCircularProgress } from '../ui';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const sizeMap: Record<NonNullable<LoadingSpinnerProps['size']>, number> = {
  sm: 16,
  md: 32,
  lg: 48,
};

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  return <UiCircularProgress size={sizeMap[size]} text={text} />;
}
