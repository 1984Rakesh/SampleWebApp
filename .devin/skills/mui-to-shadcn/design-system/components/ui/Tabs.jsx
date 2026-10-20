import React, { createContext, useContext, useState } from 'react';
import { cn } from './utils.js';
const TabsCtx = createContext({ value: undefined, set: () => {} });
export function Tabs({ value, defaultValue, onValueChange, className, children, ...props }) {
  const [inner, setInner] = useState(defaultValue);
  const v = value !== undefined ? value : inner;
  const set = (n) => { if (value === undefined) setInner(n); if (onValueChange) onValueChange(n); };
  return <TabsCtx.Provider value={{ value: v, set }}><div data-slot="tabs" className={cn('flex flex-col gap-2', className)} {...props}>{children}</div></TabsCtx.Provider>;
}
export function TabsList({ className, ...props }) {
  return <div role="tablist" data-slot="tabs-list" className={cn('bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]', className)} {...props} />;
}
export function TabsTrigger({ value, className, children, disabled, ...props }) {
  const c = useContext(TabsCtx); const active = c.value === value;
  return (
    <button type="button" role="tab" aria-selected={active} data-state={active ? 'active' : 'inactive'} data-slot="tabs-trigger" disabled={disabled} onClick={() => c.set(value)}
      className={cn("data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] cursor-pointer focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm", className)}
      {...props}>{children}</button>
  );
}
export function TabsContent({ value, className, ...props }) {
  const c = useContext(TabsCtx); if (c.value !== value) return null;
  return <div role="tabpanel" data-slot="tabs-content" className={cn('flex-1 outline-none', className)} {...props} />;
}
