import React from 'react';
import { Checkbox } from '../forms/Checkbox.jsx';
import { Chip } from '../core/Chip.jsx';
import { Icon } from '../core/Icon.jsx';
export function TaskRow({ task, onToggle, divider = true, style }) {
  const done = task.status === 'Done';
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '18px 24px', borderTop: divider ? '1px solid var(--border-subtle)' : 0, ...style }}>
      <Checkbox checked={done} label={(done ? 'Mark not done: ' : 'Mark complete: ') + task.title} onChange={() => onToggle && onToggle(task)} style={{ marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 600, lineHeight: '22px', textDecoration: done ? 'line-through' : 'none', color: done ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{task.title}</div>
        {task.description ? <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 2 }}>{task.description}</div> : null}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
          <Chip status={task.status} />
          <Chip priority={task.priority} />
        </div>
      </div>
      {task.dueLabel ? (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, whiteSpace: 'nowrap', fontWeight: task.dueToday ? 600 : 400,
          color: task.dueToday ? 'var(--amber-text)' : 'var(--text-secondary)' }}>
          <Icon name="calendar" size={14} />{task.dueLabel}
        </div>
      ) : null}
    </div>
  );
}
