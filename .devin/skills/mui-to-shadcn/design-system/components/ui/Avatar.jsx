import React, { useState } from 'react';
import { cn } from './utils.js';
export function Avatar({ className, ...props }) {
  return <span data-slot="avatar" className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)} {...props} />;
}
export function AvatarImage({ className, src, alt = '', ...props }) {
  const [ok, setOk] = useState(true);
  if (!src || !ok) return null;
  return <img data-slot="avatar-image" src={src} alt={alt} onError={() => setOk(false)} className={cn('absolute inset-0 aspect-square size-full object-cover', className)} {...props} />;
}
export function AvatarFallback({ className, ...props }) {
  return <span data-slot="avatar-fallback" className={cn('bg-muted flex size-full items-center justify-center rounded-full text-sm font-medium', className)} {...props} />;
}
