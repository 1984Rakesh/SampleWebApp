import React from 'react';
import { cn } from '../ui/utils.js';
const COLORS = { Completed: 'bg-chart-1', 'In progress': 'bg-chart-2', 'To do': 'bg-chart-3' };
export function TaskProgress({ segments = [], legend = true, label, className }) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const color = (s) => s.className || COLORS[s.label] || 'bg-chart-3';
  return (
    <div data-slot="task-progress" className={cn('flex flex-col gap-4', className)}>
      <div role="img" aria-label={label || segments.map((s) => s.label + ' ' + s.value).join(', ')} className="flex h-2 gap-1">
        {segments.filter((s) => s.value > 0).map((s) => <span key={s.label} className={cn('rounded-full', color(s))} style={{ flex: s.value / total + ' 1 0' }} />)}
      </div>
      {legend ? (
        <div className="flex flex-col gap-2.5">
          {segments.map((s) => (
            <div key={s.label} className="flex items-center gap-2.5 text-sm">
              <span aria-hidden="true" className={cn('size-2 rounded-[2px]', color(s))} />
              <span className="text-muted-foreground flex-1">{s.label}</span>
              <span className="font-medium tabular-nums">{s.value}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
