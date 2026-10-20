import React from 'react';
import { Icon } from './Icon.jsx';
export function Logo({ name = 'Clean Architecture', showWordmark = true, size = 32, href, onClick, style }) {
  const inner = [
    <span key="m" aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size,
      borderRadius: Math.round(size * 0.28), background: 'var(--primary)', color: 'var(--on-primary)', flexShrink: 0 }}>
      <Icon name="check" size={Math.round(size * 0.56)} />
    </span>,
    showWordmark ? <span key="w" style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{name}</span> : null,
  ];
  const s = { display: 'inline-flex', alignItems: 'center', gap: 10, background: 'none', border: 0, padding: 0, cursor: (href || onClick) ? 'pointer' : 'default', textDecoration: 'none', ...style };
  if (href) return <a href={href} onClick={onClick} aria-label={name} style={s}>{inner}</a>;
  if (onClick) return <button type="button" onClick={onClick} aria-label={name} style={s}>{inner}</button>;
  return <span style={s}>{inner}</span>;
}
