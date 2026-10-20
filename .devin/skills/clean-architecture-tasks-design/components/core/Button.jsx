import React, { useState } from 'react';
import { Icon } from './Icon.jsx';
export function Button({ variant = 'primary', size = 'md', startIcon, endIcon, disabled = false, fullWidth = false, href, type = 'button', onClick, children, style, ...rest }) {
  const [hover, setHover] = useState(false);
  const h = hover && !disabled;
  const sm = size === 'sm';
  const variants = {
    primary: { background: h ? 'var(--primary-hover)' : 'var(--primary)', color: 'var(--on-primary)', borderColor: 'transparent' },
    outlined: { background: h ? 'var(--hover-overlay)' : 'transparent', color: 'var(--text-primary)', borderColor: 'var(--border-input)' },
    text: { background: h ? 'var(--hover-overlay)' : 'transparent', color: 'var(--primary-soft)', borderColor: 'transparent' },
  };
  const s = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: sm ? '7px 14px' : 'var(--button-pad)', borderRadius: 'var(--radius-control)', border: '1px solid',
    fontFamily: 'var(--font-body)', fontSize: sm ? 14 : 15, fontWeight: 600, lineHeight: '20px', whiteSpace: 'nowrap',
    cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, textDecoration: 'none',
    width: fullWidth ? '100%' : undefined, transition: 'background-color .15s ease, border-color .15s ease',
    ...variants[variant], ...style,
  };
  const content = [
    startIcon ? <Icon key="s" name={startIcon} size={sm ? 16 : 18} /> : null,
    children,
    endIcon ? <Icon key="e" name={endIcon} size={sm ? 16 : 18} /> : null,
  ];
  const ev = { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false) };
  if (href && !disabled) return <a href={href} onClick={onClick} style={s} {...ev} {...rest}>{content}</a>;
  return <button type={type} disabled={disabled} onClick={onClick} style={s} {...ev} {...rest}>{content}</button>;
}
