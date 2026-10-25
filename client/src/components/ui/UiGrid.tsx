import { cn } from './utils';
import { gapClass, mbClass } from './spacing';

interface UiGridProps {
  children: React.ReactNode;
  spacing?: number;
  mb?: number;
}

export function UiGrid({ children, spacing = 3, mb }: UiGridProps) {
  return (
    <div className={cn('grid grid-cols-12', gapClass(spacing), mbClass(mb))}>
      {children}
    </div>
  );
}

interface UiGridItemProps {
  children: React.ReactNode;
  sm?: number;
  md?: number;
  lg?: number;
}

const smSpanMap = {
  1: 'sm:col-span-1', 2: 'sm:col-span-2', 3: 'sm:col-span-3', 4: 'sm:col-span-4',
  5: 'sm:col-span-5', 6: 'sm:col-span-6', 7: 'sm:col-span-7', 8: 'sm:col-span-8',
  9: 'sm:col-span-9', 10: 'sm:col-span-10', 11: 'sm:col-span-11', 12: 'sm:col-span-12',
} as const;

const mdSpanMap = {
  1: 'md:col-span-1', 2: 'md:col-span-2', 3: 'md:col-span-3', 4: 'md:col-span-4',
  5: 'md:col-span-5', 6: 'md:col-span-6', 7: 'md:col-span-7', 8: 'md:col-span-8',
  9: 'md:col-span-9', 10: 'md:col-span-10', 11: 'md:col-span-11', 12: 'md:col-span-12',
} as const;

const lgSpanMap = {
  1: 'lg:col-span-1', 2: 'lg:col-span-2', 3: 'lg:col-span-3', 4: 'lg:col-span-4',
  5: 'lg:col-span-5', 6: 'lg:col-span-6', 7: 'lg:col-span-7', 8: 'lg:col-span-8',
  9: 'lg:col-span-9', 10: 'lg:col-span-10', 11: 'lg:col-span-11', 12: 'lg:col-span-12',
} as const;

export function UiGridItem({ children, sm, md, lg }: UiGridItemProps) {
  return (
    <div className={cn('col-span-12', sm && smSpanMap[sm as keyof typeof smSpanMap], md && mdSpanMap[md as keyof typeof mdSpanMap], lg && lgSpanMap[lg as keyof typeof lgSpanMap])}>
      {children}
    </div>
  );
}
