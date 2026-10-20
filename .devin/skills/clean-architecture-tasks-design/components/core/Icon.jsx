import React from 'react';
const LUCIDE = 'https://unpkg.com/lucide-static@0.460.0/icons/';
export function Icon({ name, size = 18, color = 'currentColor', label, style, ...rest }) {
  const url = 'url("' + LUCIDE + name + '.svg")';
  return (
    <span role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}
      style={{ display: 'inline-block', flexShrink: 0, width: size, height: size, backgroundColor: color,
        WebkitMaskImage: url, maskImage: url, WebkitMaskSize: 'contain', maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center', ...style }}
      {...rest} />
  );
}
