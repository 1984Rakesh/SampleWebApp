import React from 'react';
const PRIORITY = { High: 'high', Medium: 'medium', Low: 'low' };
const STATUS = { 'To do': 'todo', 'In progress': 'inprogress', Done: 'done' };
export function Chip({ priority, status, tone, dot, children, style, ...rest }) {
  const t = tone || (priority ? PRIORITY[priority] : status ? STATUS[status] : 'neutral');
  const label = children != null ? children : (priority || status);
  const showDot = dot != null ? dot : !!priority;
  const fg = t === 'neutral' ? 'var(--neutral-tile-text)' : 'var(--chip-' + t + '-fg)';
  const bg = t === 'neutral' ? 'var(--neutral-tile)' : 'var(--chip-' + t + '-bg)';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 24, padding: '0 10px', borderRadius: 999,
      background: bg, color: fg, fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, lineHeight: 1, whiteSpace: 'nowrap', ...style }} {...rest}>
      {showDot ? <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: 999, background: fg, flexShrink: 0 }} /> : null}
      {label}
    </span>
  );
}
