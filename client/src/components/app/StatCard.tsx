// @ds StatCard v2026-10-20
import type { ReactNode } from 'react';
import { CircleCheck, Clock, List, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

const TONES: Record<'done' | 'inprogress' | 'todo', [string, LucideIcon]> = {
  done: ['bg-status-done text-status-done-foreground', CircleCheck],
  inprogress: ['bg-status-progress text-status-progress-foreground', Clock],
  todo: ['bg-status-todo text-status-todo-foreground', List],
};

const ICONS: Record<string, LucideIcon> = {
  'circle-check': CircleCheck,
  clock: Clock,
  list: List,
};

export interface StatCardProps {
  label: string;
  value: ReactNode;
  caption?: string;
  tone?: 'done' | 'inprogress' | 'todo';
  icon?: string;
  captionTone?: 'warning' | 'amber';
}

export function StatCard({ label, value, caption, tone = 'todo', icon, captionTone }: StatCardProps) {
  const t = TONES[tone] ?? TONES.todo;
  const Icon = (icon && ICONS[icon]) || t[1];
  const warn = captionTone === 'warning' || captionTone === 'amber';
  return (
    <Card data-slot="stat-card" className="gap-4">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-4xl font-bold tabular-nums">{value}</CardTitle>
        <CardAction>
          <span className={cn('inline-flex size-9 items-center justify-center rounded-lg', t[0])}>
            <Icon className="size-4" />
          </span>
        </CardAction>
      </CardHeader>
      {caption ? <CardFooter className={cn('text-sm', warn ? 'font-medium text-warning' : 'text-muted-foreground')}>{caption}</CardFooter> : null}
    </Card>
  );
}
