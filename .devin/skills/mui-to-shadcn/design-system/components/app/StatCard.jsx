import React from 'react';
import { cn } from '../ui/utils.js';
import { Icon } from '../ui/Icon.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardFooter } from '../ui/Card.jsx';
const TONES = {
  done: ['bg-status-done text-status-done-foreground', 'circle-check'],
  inprogress: ['bg-status-progress text-status-progress-foreground', 'clock'],
  todo: ['bg-status-todo text-status-todo-foreground', 'list'],
};
export function StatCard({ label, value, caption, tone = 'todo', icon, captionTone, className, style }) {
  const t = TONES[tone] || TONES.todo;
  const warn = captionTone === 'warning' || captionTone === 'amber';
  return (
    <Card data-slot="stat-card" className={cn('gap-4', className)} style={style}>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-4xl font-bold tabular-nums">{value}</CardTitle>
        <CardAction><span className={cn('inline-flex size-9 items-center justify-center rounded-lg', t[0])}><Icon name={icon || t[1]} /></span></CardAction>
      </CardHeader>
      {caption ? <CardFooter className={cn('text-sm', warn ? 'text-warning font-medium' : 'text-muted-foreground')}>{caption}</CardFooter> : null}
    </Card>
  );
}
