import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from './utils.js';
import { Icon } from './Icon.jsx';
const SelectCtx = createContext(null);
// Same composition API as shadcn's Radix Select, without the portal.
export function Select({ value, defaultValue, onValueChange, disabled, className, children }) {
  const [inner, setInner] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [, setTick] = useState(0);
  const labels = useRef({});
  const root = useRef(null);
  const v = value !== undefined ? value : inner;
  useLayoutEffect(() => { setTick((t) => t + 1); }, []);
  useEffect(() => {
    if (!open) return;
    const down = (e) => { if (root.current && !root.current.contains(e.target)) setOpen(false); };
    const key = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', down); document.addEventListener('keydown', key);
    return () => { document.removeEventListener('mousedown', down); document.removeEventListener('keydown', key); };
  }, [open]);
  const select = (n) => { if (value === undefined) setInner(n); if (onValueChange) onValueChange(n); setOpen(false); };
  return (
    <SelectCtx.Provider value={{ value: v, open, setOpen, select, labels: labels.current, disabled }}>
      <div ref={root} data-slot="select" className={cn('relative inline-flex', className)}>{children}</div>
    </SelectCtx.Provider>
  );
}
export function SelectTrigger({ className, size = 'default', children, ...props }) {
  const c = useContext(SelectCtx);
  return (
    <button type="button" role="combobox" aria-expanded={c.open} data-slot="select-trigger" data-size={size} disabled={c.disabled} onClick={() => c.setOpen(!c.open)}
      className={cn('border-input dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none cursor-pointer focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8', className)}
      {...props}>{children}<Icon name="chevron-down" className="size-4 opacity-50" /></button>
  );
}
export function SelectValue({ placeholder, className }) {
  const c = useContext(SelectCtx);
  const has = c.value !== undefined && c.value !== null && c.value !== '';
  const label = has ? (c.labels[c.value] !== undefined ? c.labels[c.value] : c.value) : placeholder;
  return <span data-slot="select-value" className={cn('flex items-center gap-2 truncate', !has && 'text-muted-foreground', className)}>{label}</span>;
}
export function SelectContent({ className, align = 'start', children }) {
  const c = useContext(SelectCtx);
  return (
    <div role="listbox" data-slot="select-content" data-state={c.open ? 'open' : 'closed'}
      className={cn('bg-popover text-popover-foreground absolute top-full z-50 mt-1 min-w-full w-max max-h-72 overflow-y-auto rounded-md border p-1 shadow-md', align === 'end' ? 'right-0' : 'left-0', !c.open && 'hidden', className)}>
      {children}
    </div>
  );
}
export function SelectItem({ value, className, children, disabled }) {
  const c = useContext(SelectCtx);
  c.labels[value] = children;
  const sel = c.value === value;
  return (
    <button type="button" role="option" aria-selected={sel} data-slot="select-item" disabled={disabled} onClick={() => c.select(value)}
      className={cn('relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-left text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent disabled:pointer-events-none disabled:opacity-50', className)}>
      {children}
      {sel ? <span className="absolute right-2 flex size-3.5 items-center justify-center"><Icon name="check" className="size-4" /></span> : null}
    </button>
  );
}
