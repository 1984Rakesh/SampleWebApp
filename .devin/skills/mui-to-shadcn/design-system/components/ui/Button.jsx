import React from 'react';
import { cva } from './utils.js';
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive: 'bg-destructive text-background shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20',
        outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>[data-slot=icon]]:px-3',
        sm: 'h-8 gap-1.5 px-3 has-[>[data-slot=icon]]:px-2.5',
        lg: 'h-10 px-6 has-[>[data-slot=icon]]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);
export function Button({ className, variant, size, href, type = 'button', ...props }) {
  const cls = buttonVariants({ variant, size, className });
  if (href) return <a data-slot="button" href={href} className={cls} {...props} />;
  return <button data-slot="button" type={type} className={cls} {...props} />;
}
