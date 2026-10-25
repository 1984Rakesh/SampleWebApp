// @ds Logo v2026-10-20
import { Check } from 'lucide-react';
import { cn } from '../ui/utils';

/** Brand mark: bg-primary rounded square with a check + Bricolage wordmark. */
export interface LogoProps {
  name?: string;
  showWordmark?: boolean;
  hideWordmarkBelow?: 'sm' | 'md';
  href?: string;
  onClick?: () => void;
}

const wordmarkVisibilityMap = {
  sm: 'hidden sm:inline',
  md: 'hidden md:inline',
} as const;

export function Logo({ name = 'Clean Architecture', showWordmark = true, hideWordmarkBelow, href, onClick }: LogoProps) {
  const inner = (
    <>
      <span aria-hidden="true" className="bg-primary text-primary-foreground inline-flex size-8 shrink-0 items-center justify-center rounded-lg">
        <Check className="size-[18px]" />
      </span>
      {showWordmark ? (
        <span className={cn('font-heading text-foreground text-lg font-bold tracking-tight whitespace-nowrap', hideWordmarkBelow && wordmarkVisibilityMap[hideWordmarkBelow])}>{name}</span>
      ) : null}
    </>
  );
  const cls = cn('inline-flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50', (href || onClick) && 'cursor-pointer');
  if (href) return <a data-slot="logo" href={href} onClick={onClick} aria-label={name} className={cls}>{inner}</a>;
  if (onClick) return <button data-slot="logo" type="button" onClick={onClick} aria-label={name} className={cls}>{inner}</button>;
  return <span data-slot="logo" className={cls}>{inner}</span>;
}
