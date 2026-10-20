import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';
export function Checkbox({ checked = false, onChange, label, size = 22, disabled = false, style }) {
  const [hover, setHover] = useState(false);
  return (
    <button type="button" role="checkbox" aria-checked={checked} aria-label={label} disabled={disabled}
      onClick={() => onChange && onChange(!checked)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, padding: 0, flexShrink: 0,
        borderRadius: 999, cursor: disabled ? 'not-allowed' : 'pointer',
        border: '2px solid ' + (checked ? 'var(--done)' : hover ? 'var(--text-secondary)' : 'var(--checkbox-ring)'),
        background: checked ? 'var(--done)' : 'transparent', color: 'var(--on-done)', transition: 'background-color .15s ease, border-color .15s ease', ...style }}>
      {checked ? <Icon name="check" size={Math.round(size * 0.62)} style={{ strokeWidth: 3 }} /> : null}
    </button>
  );
}
