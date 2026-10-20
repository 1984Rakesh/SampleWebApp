import React, { createContext, useContext, useEffect, useState } from 'react';
import { cn } from './utils.js';
import { Icon } from './Icon.jsx';
const DialogCtx = createContext({ open: false, setOpen: () => {} });
// Same composition API as shadcn's Radix Dialog. Renders in place (fixed), so it inherits .dark from its subtree.
export function Dialog({ open, defaultOpen = false, onOpenChange, children }) {
  const [inner, setInner] = useState(defaultOpen);
  const o = open !== undefined ? open : inner;
  const setOpen = (n) => { if (open === undefined) setInner(n); if (onOpenChange) onOpenChange(n); };
  return <DialogCtx.Provider value={{ open: o, setOpen }}>{children}</DialogCtx.Provider>;
}
function useOpenSetter(children, next) {
  const c = useContext(DialogCtx);
  const on = (e) => { if (children && children.props && children.props.onClick) children.props.onClick(e); c.setOpen(next); };
  return React.isValidElement(children) ? React.cloneElement(children, { onClick: on }) : <button type="button" onClick={on}>{children}</button>;
}
export function DialogTrigger({ children }) { return useOpenSetter(children, true); }
export function DialogClose({ children }) { return useOpenSetter(children, false); }
export function DialogContent({ className, children, showCloseButton = true, ...props }) {
  const c = useContext(DialogCtx);
  useEffect(() => {
    if (!c.open) return;
    const k = (e) => { if (e.key === 'Escape') c.setOpen(false); };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [c.open]);
  if (!c.open) return null;
  return (
    <div data-slot="dialog-portal">
      <div data-slot="dialog-overlay" className="fixed inset-0 z-50 bg-black/50" onClick={() => c.setOpen(false)} />
      <div role="dialog" aria-modal="true" data-slot="dialog-content"
        className={cn('bg-background text-foreground fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg sm:max-w-lg', className)} {...props}>
        {children}
        {showCloseButton ? (
          <button type="button" data-slot="dialog-close" onClick={() => c.setOpen(false)}
            className="absolute top-4 right-4 inline-flex rounded-xs opacity-70 transition-opacity outline-none cursor-pointer hover:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50">
            <Icon name="x" /><span className="sr-only">Close</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
export function DialogHeader({ className, ...props }) { return <div data-slot="dialog-header" className={cn('flex flex-col gap-2 text-center sm:text-left', className)} {...props} />; }
export function DialogFooter({ className, ...props }) { return <div data-slot="dialog-footer" className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props} />; }
export function DialogTitle({ className, ...props }) { return <h2 data-slot="dialog-title" className={cn('font-heading text-lg leading-none font-semibold tracking-tight', className)} {...props} />; }
export function DialogDescription({ className, ...props }) { return <p data-slot="dialog-description" className={cn('text-muted-foreground text-sm', className)} {...props} />; }
