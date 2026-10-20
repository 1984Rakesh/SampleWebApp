import { cn } from '@/lib/utils';

const toneMap = {
  'chart-1': 'bg-chart-1',
  'chart-2': 'bg-chart-2',
  'chart-3': 'bg-chart-3',
} as const;

interface UiSwatchProps {
  tone: keyof typeof toneMap;
}

// Inline color legend marker, sized/aligned to sit inside a text line.
export default function UiSwatch({ tone }: UiSwatchProps) {
  return <span aria-hidden="true" className={cn('mr-1.5 inline-block size-2.5 rounded-sm align-middle', toneMap[tone])} />;
}
