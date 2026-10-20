import React from 'react';
import { cn } from '../ui/utils.js';
import { Icon } from '../ui/Icon.jsx';
export function Logo({ name = 'Clean Architecture', showWordmark = true, href, onClick, className }) {
  const inner = [
    <span key="m" aria-hidden="true" className="bg-primary text-primary-foreground inline-flex size-8 shrink-0 items-center justify-center rounded-lg"><Icon name="check" className="size-[18px]" /></span>,
    showWordmark ? <span key="w" className="font-heading text-foreground text-lg font-bold tracking-tight whitespace-nowrap">{name}</span> : null,
  ];
  const cls = cn('inline-flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50', (href || onClick) && 'cursor-pointer', className);
  if (href) return <a data-slot="logo" href={href} onClick={onClick} aria-label={name} className={cls}>{inner}</a>;
  if (onClick) return <button data-slot="logo" type="button" onClick={onClick} aria-label={name} className={cls}>{inner}</button>;
  return <span data-slot="logo" className={cls}>{inner}</span>;
}
