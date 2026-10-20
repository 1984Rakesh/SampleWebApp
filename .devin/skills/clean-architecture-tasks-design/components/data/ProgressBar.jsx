import React from 'react';
const DEFAULT_COLORS = { Completed: 'var(--done)', 'In progress': 'var(--bar-in-progress)', 'To do': 'var(--bar-todo)' };
export function ProgressBar({ segments = [], height = 10, legend = false, label, style }) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const color = (s) => s.color || DEFAULT_COLORS[s.label] || 'var(--bar-todo)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, ...style }}>
      <div role="img" aria-label={label || segments.map((s) => s.label + ' ' + s.value).join(', ')} style={{ display: 'flex', gap: 4, height }}>
        {segments.filter((s) => s.value > 0).map((s) => (
          <span key={s.label} style={{ flex: s.value / total + ' 1 0', borderRadius: 999, background: color(s) }} />
        ))}
      </div>
      {legend ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {segments.map((s) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
              <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: 2, background: color(s) }} />
              <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{s.label}</span>
              <span style={{ fontWeight: 600 }}>{s.value}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
