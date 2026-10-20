import { cn } from '@/lib/utils';
import { gapClass, mtClass, mbClass } from './spacing';

type Breakpoint = 'sm' | 'md' | 'lg';

interface UiStackProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  rowFrom?: Breakpoint;
  spacing?: number;
  align?: 'start' | 'center' | 'end' | 'stretch';
  wrap?: boolean;
  mt?: number;
  mb?: number;
}

const alignMap = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
} as const;

const rowFromMap: Record<Breakpoint, string> = {
  sm: 'sm:flex-row',
  md: 'md:flex-row',
  lg: 'lg:flex-row',
};

const rowFromAlignMap: Record<Breakpoint, Record<keyof typeof alignMap, string>> = {
  sm: { start: 'sm:items-start', center: 'sm:items-center', end: 'sm:items-end', stretch: 'sm:items-stretch' },
  md: { start: 'md:items-start', center: 'md:items-center', end: 'md:items-end', stretch: 'md:items-stretch' },
  lg: { start: 'lg:items-start', center: 'lg:items-center', end: 'lg:items-end', stretch: 'lg:items-stretch' },
};

export default function UiStack({
  children,
  direction = 'column',
  rowFrom,
  spacing = 2,
  align,
  wrap = false,
  mt,
  mb,
}: UiStackProps) {
  return (
    <div
      className={cn(
        'flex',
        rowFrom ? cn('flex-col', rowFromMap[rowFrom]) : direction === 'column' ? 'flex-col' : 'flex-row',
        gapClass(spacing),
        rowFrom
          ? cn('items-stretch', rowFromAlignMap[rowFrom][align ?? 'stretch'])
          : align && alignMap[align],
        wrap && 'flex-wrap',
        mtClass(mt),
        mbClass(mb),
      )}
    >
      {children}
    </div>
  );
}
