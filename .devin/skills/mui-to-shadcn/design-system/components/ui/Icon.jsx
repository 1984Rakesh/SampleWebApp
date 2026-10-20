import React from 'react';
import { cn } from './utils.js';
const LUCIDE = 'https://unpkg.com/lucide-static@0.460.0/icons/';
// Lucide glyph as a currentColor mask. Production: import the matching component from lucide-react.
export function Icon({ name, size, label, className, style, ...rest }) {
  const url = 'url("' + LUCIDE + name + '.svg")';
  return (
    <span data-slot="icon" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}
      className={cn('inline-block shrink-0 bg-current', !size && 'size-4', className)}
      style={{ width: size, height: size, WebkitMaskImage: url, maskImage: url, WebkitMaskSize: 'contain', maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center', ...style }}
      {...rest} />
  );
}
