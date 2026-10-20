import { cn } from '@/lib/utils';
import { gapClass } from './spacing';

const templateMap = {
  sidebar: 'md:grid-cols-[280px_minmax(0,1fr)]',
  rail: 'lg:grid-cols-[minmax(0,1fr)_320px]',
} as const;

interface UiAsideGridProps {
  template: keyof typeof templateMap;
  gap?: number;
  children: React.ReactNode;
}

// Two-region page grid: 'sidebar' puts a fixed left column before content on md+,
// 'rail' puts a fixed right rail after content on lg+. Children render in order.
export default function UiAsideGrid({ template, gap = 3, children }: UiAsideGridProps) {
  return <div className={cn('grid items-start', gapClass(gap), templateMap[template])}>{children}</div>;
}
