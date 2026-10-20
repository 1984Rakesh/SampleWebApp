import React from 'react';
export function Avatar({ name = '', size = 32, style, ...rest }) {
  const initial = (name.trim()[0] || '?').toUpperCase();
  return (
    <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size,
      borderRadius: 999, background: 'var(--primary)', color: 'var(--on-primary)', fontFamily: 'var(--font-display)', fontWeight: 700,
      fontSize: Math.round(size * 0.42), lineHeight: 1, flexShrink: 0, ...style }} {...rest}>{initial}</span>
  );
}
