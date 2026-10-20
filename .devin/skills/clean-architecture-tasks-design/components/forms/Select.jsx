import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';
export function Select({ value, onChange, options = [], label, style, ...rest }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexShrink: 0, ...style }}>
      <select aria-label={label} value={value} onChange={(e) => onChange && onChange(e.target.value, e)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ appearance: 'none', WebkitAppearance: 'none', height: 44, padding: '0 38px 0 14px', borderRadius: 'var(--radius-control)',
          border: '1px solid ' + (focus ? 'var(--primary)' : 'var(--border-control)'), background: 'var(--bg-paper)', color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, cursor: 'pointer', outline: 'none', width: '100%' }} {...rest}>
        {options.map((o) => { const v = typeof o === 'string' ? o : o.value; const l = typeof o === 'string' ? o : o.label; return <option key={v} value={v}>{l}</option>; })}
      </select>
      <Icon name="chevron-down" size={16} color="var(--text-secondary)" style={{ position: 'absolute', right: 14, top: 14, pointerEvents: 'none' }} />
    </div>
  );
}
