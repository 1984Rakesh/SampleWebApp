import React from 'react';
import { cn } from './utils.js';
export function Separator({ className, orientation = 'horizontal', decorative = true, ...props }) {
  return <div role={decorative ? 'none' : 'separator'} data-slot="separator" data-orientation={orientation}
    className={cn('bg-border shrink-0', orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px self-stretch', className)} {...props} />;
}
