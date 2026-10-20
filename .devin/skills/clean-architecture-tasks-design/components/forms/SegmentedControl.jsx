import React from 'react';
const TONES = { High: 'high', Medium: 'medium', Low: 'low' };
export function SegmentedControl({ options = [], value, onChange, label, tinted = false, fullWidth = false, style }) {
  return (
    <div role="radiogroup" aria-label={label} style={{ display: fullWidth ? 'flex' : 'inline-flex', gap: 2, padding: 4, background: 'var(--bg-segmented)',
      border: '1px solid var(--border-control)', borderRadius: 'var(--radius-control)', ...style }}>
      {options.map((o) => {
        const v = typeof o === 'string' ? o : o.value; const l = typeof o === 'string' ? o : o.label;
        const sel = v === value; const tone = tinted && TONES[v];
        const selBg = tone ? 'var(--chip-' + tone + '-bg)' : 'var(--segmented-selected-bg)';
        const selFg = tone ? 'var(--chip-' + tone + '-fg)' : 'var(--text-primary)';
        return (
          <button key={v} type="button" role="radio" aria-checked={sel} onClick={() => onChange && onChange(v)}
            style={{ flex: fullWidth ? 1 : undefined, minHeight: 36, padding: '0 14px', border: 0, borderRadius: 'var(--radius-segment)',
              background: sel ? selBg : 'transparent', color: sel ? selFg : 'var(--text-secondary)',
              boxShadow: sel && !tone ? 'var(--segmented-selected-shadow)' : 'none',
              fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: sel ? 600 : 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>{l}</button>
        );
      })}
    </div>
  );
}
