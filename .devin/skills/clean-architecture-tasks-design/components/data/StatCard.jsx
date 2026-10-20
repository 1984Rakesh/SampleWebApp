import React from 'react';
import { Card } from '../core/Card.jsx';
import { Icon } from '../core/Icon.jsx';
const TILE = {
  done: ['var(--chip-done-bg)', 'var(--chip-done-fg)', 'circle-check'],
  inprogress: ['var(--chip-inprogress-bg)', 'var(--chip-inprogress-fg)', 'clock'],
  todo: ['var(--neutral-tile)', 'var(--neutral-tile-text)', 'list'],
};
export function StatCard({ label, value, caption, tone = 'todo', icon, captionTone, style }) {
  const [bg, fg, defIcon] = TILE[tone] || TILE.todo;
  return (
    <Card padding={24} style={{ flex: '1 1 240px', ...style }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 'var(--radius-tile)', background: bg, color: fg }}>
          <Icon name={icon || defIcon} size={18} />
        </span>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1, marginTop: 4 }}>{value}</div>
      {caption ? <div style={{ marginTop: 14, fontSize: 13, color: captionTone === 'amber' ? 'var(--amber-text)' : 'var(--text-secondary)' }}>{caption}</div> : null}
    </Card>
  );
}
