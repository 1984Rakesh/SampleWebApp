import React from 'react';
export function Tabs({ items = [], value, onChange, label, style }) {
  return (
    <div role="tablist" aria-label={label} style={{ display: 'inline-flex', gap: 2, padding: 4, background: 'var(--bg-paper)',
      border: '1px solid var(--border-control)', borderRadius: 'var(--radius-control)', flexShrink: 0, ...style }}>
      {items.map((it) => {
        const sel = it.value === value;
        return (
          <button key={it.value} type="button" role="tab" aria-selected={sel} onClick={() => onChange && onChange(it.value)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 34, padding: '0 12px', borderRadius: 'var(--radius-segment)', border: 0,
              background: sel ? 'var(--selected-tab)' : 'transparent', color: sel ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {it.label}
            {it.count != null ? <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{it.count}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
