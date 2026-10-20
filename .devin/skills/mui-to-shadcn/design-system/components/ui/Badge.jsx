import React from 'react';
import { cva } from './utils.js';
export const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 [&>[data-slot=icon]]:size-3 transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-background',
        outline: 'text-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);
export function Badge({ className, variant, ...props }) {
  return <span data-slot="badge" className={badgeVariants({ variant, className })} {...props} />;
}
