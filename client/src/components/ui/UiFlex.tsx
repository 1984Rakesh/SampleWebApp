import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import { gapClass, pClass, pxClass, pyClass, ptClass, mtClass, mbClass, mlClass, mrClass } from './spacing';

interface UiFlexProps {
  children?: React.ReactNode;
  inline?: boolean;
  column?: boolean;
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'space-between';
  gap?: number;
  wrap?: boolean;
  grow?: boolean;
  flex?: number;
  fullWidth?: boolean;
  fixedWidthFrom?: 'sm' | 'md' | 'lg';
  minWidth0?: boolean;
  centered?: boolean;
  dividerTop?: boolean;
  rounded?: boolean;
  bgColor?: string;
  p?: number;
  px?: number;
  py?: number;
  pt?: number;
  mt?: number | 'auto';
  mb?: number;
  ml?: number;
  mr?: number | 'auto';
  textAlign?: 'center';
  role?: string;
  ariaLabel?: string;
}

const alignMap = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
} as const;

// Fixed narrow-field width that kicks in at a breakpoint; full width below it.
const fixedWidthFromMap = {
  sm: 'w-full sm:w-40',
  md: 'w-full md:w-40',
  lg: 'w-full lg:w-40',
} as const;

const justifyMap = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  'space-between': 'justify-between',
} as const;

export default function UiFlex({
  children,
  inline = false,
  column = false,
  align,
  justify,
  gap,
  wrap = false,
  grow = false,
  flex,
  fullWidth = false,
  fixedWidthFrom,
  minWidth0 = false,
  centered = false,
  dividerTop = false,
  rounded = false,
  bgColor,
  p,
  px,
  py,
  pt,
  mt,
  mb,
  ml,
  mr,
  textAlign,
  role,
  ariaLabel,
}: UiFlexProps) {
  const style: CSSProperties = {
    ...(flex !== undefined && { flex }),
    ...(bgColor && { backgroundColor: bgColor }),
  };

  return (
    <div
      role={role}
      aria-label={ariaLabel}
      style={Object.keys(style).length ? style : undefined}
      className={cn(
        inline ? 'inline-flex' : 'flex',
        column && 'flex-col',
        centered && 'min-h-screen items-center justify-center',
        align && !centered && alignMap[align],
        justify && !centered && justifyMap[justify],
        gapClass(gap),
        wrap && 'flex-wrap',
        grow && 'grow',
        fullWidth && 'w-full',
        fixedWidthFrom && fixedWidthFromMap[fixedWidthFrom],
        minWidth0 && 'min-w-0',
        dividerTop && 'mt-6 border-t border-border pt-6',
        rounded && 'rounded',
        textAlign && 'text-center',
        pClass(p),
        pxClass(px),
        pyClass(py),
        ptClass(pt),
        mtClass(mt),
        mbClass(mb),
        mlClass(ml),
        mrClass(mr),
      )}
    >
      {children}
    </div>
  );
}
