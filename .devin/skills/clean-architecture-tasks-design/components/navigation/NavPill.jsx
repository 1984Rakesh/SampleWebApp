import React, { useState } from 'react';
export function NavPill({ active = false, href, onClick, children, style }) {
  const [hover, setHover] = useState(false);
  const s = { display: 'inline-flex', alignItems: 'center', padding: 'var(--nav-pad)', borderRadius: 999, border: 0,
    background: active ? 'var(--selected-nav)' : 'transparent', color: active || hover ? 'var(--text-primary)' : 'var(--text-secondary)',
    fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, lineHeight: '20px', textDecoration: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
    transition: 'color .15s ease', ...style };
  const ev = { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), 'aria-current': active ? 'page' : undefined };
  if (href) return <a href={href} onClick={onClick} style={s} {...ev}>{children}</a>;
  return <button type="button" onClick={onClick} style={s} {...ev}>{children}</button>;
}
