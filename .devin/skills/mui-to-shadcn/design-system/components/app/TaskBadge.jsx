import React from 'react';
import { cn } from '../ui/utils.js';
import { Badge } from '../ui/Badge.jsx';
const TONES = {
  'To do': 'bg-status-todo text-status-todo-foreground',
  'In progress': 'bg-status-progress text-status-progress-foreground',
  Done: 'bg-status-done text-status-done-foreground',
  High: 'bg-priority-high text-priority-high-foreground',
  Medium: 'bg-priority-medium text-priority-medium-foreground',
  Low: 'bg-priority-low text-priority-low-foreground',
};
export function TaskBadge({ status, priority, className, children }) {
  const key = priority || status;
  return (
    <Badge data-slot="task-badge" variant="secondary" className={cn('rounded-full', TONES[key], className)}>
      {priority ? <span aria-hidden="true" className="size-1.5 rounded-full bg-current" /> : null}
      {children || key}
    </Badge>
  );
}
