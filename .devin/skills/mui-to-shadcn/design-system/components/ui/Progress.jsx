import React from 'react';
import { cn } from './utils.js';
export function Progress({ value = 0, className, ...props }) {
  const v = Math.max(0, Math.min(100, value || 0));
  return (
    <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={v} data-slot="progress" className={cn('bg-primary/20 relative h-2 w-full overflow-hidden rounded-full', className)} {...props}>
      <div data-slot="progress-indicator" className="bg-primary h-full w-full flex-1 transition-all" style={{ transform: 'translateX(-' + (100 - v) + '%)' }} />
    </div>
  );
}
