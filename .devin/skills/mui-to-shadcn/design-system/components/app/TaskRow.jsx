import React from 'react';
import { cn } from '../ui/utils.js';
import { Icon } from '../ui/Icon.jsx';
import { Checkbox } from '../ui/Checkbox.jsx';
import { TaskBadge } from './TaskBadge.jsx';
export function TaskRow({ task, onToggle, divider = true, className, style }) {
  const done = task.status === 'Done';
  return (
    <div data-slot="task-row" className={cn('flex items-start gap-3 px-6 py-4', divider && 'border-t', className)} style={style}>
      <Checkbox checked={done} onCheckedChange={() => onToggle && onToggle(task)} aria-label={(done ? 'Mark not done: ' : 'Mark complete: ') + task.title} className="mt-0.5 size-5 rounded-full" />
      <div className="min-w-0 flex-1">
        <div className={cn('text-sm font-medium', done && 'text-muted-foreground line-through')}>{task.title}</div>
        {task.description ? <div className="text-muted-foreground mt-0.5 text-sm">{task.description}</div> : null}
        <div className="mt-2.5 flex flex-wrap gap-1.5"><TaskBadge status={task.status} /><TaskBadge priority={task.priority} /></div>
      </div>
      {task.dueLabel ? (
        <div className={cn('inline-flex items-center gap-1.5 text-xs whitespace-nowrap', task.dueToday && !done ? 'text-warning font-medium' : 'text-muted-foreground')}>
          <Icon name="calendar" className="size-3.5" />{task.dueLabel}
        </div>
      ) : null}
    </div>
  );
}
