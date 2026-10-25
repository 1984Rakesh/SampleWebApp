import { Link as RouterLink } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { cn } from './utils';
import { mtClass, mbClass } from './spacing';

type UiTextVariant = 'pageTitle' | 'h1' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption';
type UiTextTone = 'default' | 'muted' | 'accent' | 'danger' | 'amber' | 'light' | 'lightMuted';
type UiTextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

interface UiTextProps {
  children: React.ReactNode;
  variant?: UiTextVariant;
  tone?: UiTextTone;
  weight?: UiTextWeight;
  align?: 'center' | 'left' | 'right';
  gutterBottom?: boolean;
  noWrap?: boolean;
  breakWord?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'li';
  to?: string;
  maxWidth?: number;
  mt?: number;
  mb?: number;
  strike?: boolean;
}

const variantClassMap: Record<UiTextVariant, string> = {
  pageTitle: 'font-heading text-4xl font-bold tracking-tight',
  h1: 'font-heading text-[2.625rem] font-bold leading-[1.1] tracking-[-0.02em]',
  h3: 'font-heading text-[1.75rem] font-bold tracking-[-0.02em]',
  h4: 'font-heading text-[2.125rem] font-bold tracking-[-0.02em]',
  h5: 'font-heading text-2xl font-semibold tracking-[-0.02em]',
  h6: 'font-heading text-xl font-semibold tracking-[-0.02em]',
  subtitle1: 'text-base',
  subtitle2: 'text-sm font-medium',
  body1: 'text-base',
  body2: 'text-sm',
  caption: 'text-xs',
};

const variantTagMap: Record<UiTextVariant, 'h1' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'> = {
  pageTitle: 'h1',
  h1: 'h1',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'h6',
  subtitle2: 'h6',
  body1: 'p',
  body2: 'p',
  caption: 'span',
};

const toneClassMap: Record<UiTextTone, string> = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  accent: 'text-primary',
  danger: 'text-destructive',
  amber: 'text-warning',
  light: 'text-white',
  lightMuted: 'text-white/90',
};

const alignClassMap = {
  center: 'text-center',
  left: 'text-left',
  right: 'text-right',
} as const;

const weightClassMap: Record<UiTextWeight, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export default function UiText({
  children,
  variant = 'body1',
  tone = 'default',
  weight,
  align,
  gutterBottom = false,
  noWrap = false,
  breakWord = false,
  as,
  to,
  maxWidth,
  mt,
  mb,
  strike = false,
}: UiTextProps) {
  const className = cn(
    variantClassMap[variant],
    toneClassMap[tone],
    weight && weightClassMap[weight],
    align && alignClassMap[align],
    gutterBottom && 'mb-[0.35em]',
    noWrap && 'truncate',
    breakWord && 'min-w-0 wrap-anywhere',
    strike && 'line-through',
    to && 'no-underline',
    mtClass(mt),
    mbClass(mb),
  );
  const style: CSSProperties | undefined = maxWidth !== undefined ? { maxWidth } : undefined;

  if (to) {
    return (
      <RouterLink to={to} className={className} style={style}>
        {children}
      </RouterLink>
    );
  }

  const Tag = as ?? variantTagMap[variant];
  return <Tag className={className} style={style}>{children}</Tag>;
}
