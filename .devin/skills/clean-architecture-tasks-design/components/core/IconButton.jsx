import React, { useState } from 'react';
import { Icon } from './Icon.jsx';
export function IconButton({ icon, label, tone = 'default', variant = 'outlined', size = 40, iconSize, onClick, disabled = false, style, ...rest }) {
  const [hover, setHover] = useState(false);
  const danger = tone === 'danger';
  const bare = variant === 'bare';
  const s = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, padding: 0, flexShrink: 0,
    borderRadius: bare ? 10 : 'var(--radius-control)',
    border: bare ? '1px solid transparent' : '1px solid ' + (danger ? 'var(--danger-border)' : 'var(--border-control)'),
    background: hover && !disabled ? 'var(--hover-overlay)' : 'transparent',
    color: danger ? 'var(--danger)' : bare ? 'var(--text-secondary)' : 'var(--text-primary)',
    cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, transition: 'background-color .15s ease', ...style,
  };
  return (
    <button type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick} style={s}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} {...rest}>
      <Icon name={icon} size={iconSize || (size >= 40 ? 18 : 16)} />
    </button>
  );
}
