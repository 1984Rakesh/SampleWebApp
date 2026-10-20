import React from 'react';
import { Card } from '../core/Card.jsx';
import { Chip } from '../core/Chip.jsx';
import { Checkbox } from '../forms/Checkbox.jsx';
import { IconButton } from '../core/IconButton.jsx';
const th = { padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
  color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' };
const td = { padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)', verticalAlign: 'middle' };
export function TaskTable({ tasks = [], onToggle, onEdit, onDelete, footer, emptyText = 'No tasks match these filters.', style }) {
  return (
    <Card padding={0} style={{ overflow: 'hidden', ...style }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: 860, borderCollapse: 'collapse', fontFamily: 'var(--font-body)' }}>
          <thead><tr>
            <th style={{ ...th, width: 56 }}><span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Done</span></th>
            <th style={th}>Task</th><th style={{ ...th, width: 140 }}>Status</th><th style={{ ...th, width: 140 }}>Priority</th>
            <th style={{ ...th, width: 140 }}>Due</th><th style={{ ...th, width: 110, textAlign: 'right' }}>Actions</th>
          </tr></thead>
          <tbody>
            {tasks.length === 0 ? <tr><td colSpan={6} style={{ ...td, textAlign: 'center', color: 'var(--text-secondary)', padding: 40 }}>{emptyText}</td></tr> : null}
            {tasks.map((t) => {
              const done = t.status === 'Done';
              return (
                <tr key={t.id}>
                  <td style={{ ...td, paddingLeft: 20 }}><Checkbox checked={done} label={(done ? 'Mark not done: ' : 'Mark complete: ') + t.title} onChange={() => onToggle && onToggle(t)} /></td>
                  <td style={{ ...td, maxWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, textDecoration: done ? 'line-through' : 'none', color: done ? 'var(--text-secondary)' : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.description}</div>
                  </td>
                  <td style={td}><Chip status={t.status} /></td>
                  <td style={td}><Chip priority={t.priority} /></td>
                  <td style={{ ...td, fontSize: 14, whiteSpace: 'nowrap', color: t.dueToday && !done ? 'var(--amber-text)' : 'var(--text-secondary)', fontWeight: t.dueToday && !done ? 600 : 400 }}>{t.dueLabel || '\u2014'}</td>
                  <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap', paddingRight: 20 }}>
                    <IconButton variant="bare" size={32} icon="pencil" label={'Edit ' + t.title} onClick={() => onEdit && onEdit(t)} />
                    <IconButton variant="bare" size={32} tone="danger" icon="trash-2" label={'Delete ' + t.title} onClick={() => onDelete && onDelete(t)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {footer ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', padding: '14px 20px', fontSize: 13, color: 'var(--text-secondary)' }}>{footer}</div> : null}
    </Card>
  );
}
