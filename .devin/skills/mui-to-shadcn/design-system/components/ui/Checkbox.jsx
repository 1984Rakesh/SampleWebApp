import React, { useState } from 'react';
import { cn } from './utils.js';
import { Icon } from './Icon.jsx';
export function Checkbox({ checked, defaultChecked = false, onCheckedChange, disabled, className, ...props }) {
  const [inner, setInner] = useState(defaultChecked);
  const on = checked !== undefined ? checked : inner;
  const toggle = () => { const n = !on; if (checked === undefined) setInner(n); if (onCheckedChange) onCheckedChange(n); };
  return (
    <button type="button" role="checkbox" aria-checked={on} data-slot="checkbox" data-state={on ? 'checked' : 'unchecked'} disabled={disabled} onClick={toggle}
      className={cn('peer inline-flex items-center justify-center border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none cursor-pointer focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50', className)}
      {...props}>
      {on ? <Icon name="check" className="size-3.5" /> : null}
    </button>
  );
}
