import React, { useState } from 'react';
import { Avatar } from '../core/Avatar.jsx';
export function UserPill({ name = '', href, onClick, style }) {
  const [hover, setHover] = useState(false);
  const s = { display: 'inline-flex', alignItems: 'center', gap: 10, height: 40, padding: '0 14px 0 4px', borderRadius: 999,
    border: '1px solid var(--border-control)', background: hover ? 'var(--hover-overlay)' : 'transparent', color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, textDecoration: 'none', cursor: 'pointer', whiteSpace: 'nowrap', ...style };
  const inner = [<Avatar key="a" name={name} size={32} />, <span key="n">{name}</span>];
  const ev = { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), 'aria-label': 'Profile: ' + name };
  if (href) return <a href={href} onClick={onClick} style={s} {...ev}>{inner}</a>;
  return <button type="button" onClick={onClick} style={s} {...ev}>{inner}</button>;
}
