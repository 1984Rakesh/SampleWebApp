import React from 'react';
import { cn } from '../ui/utils.js';
import { Icon } from '../ui/Icon.jsx';
import { Button } from '../ui/Button.jsx';
import { Checkbox } from '../ui/Checkbox.jsx';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table.jsx';
import { TaskBadge } from './TaskBadge.jsx';
export function TaskTable({ tasks = [], onToggle, onEdit, onDelete, footer, emptyText = 'No tasks match these filters.', className }) {
  return (
    <div data-slot="task-table" className={cn('flex flex-col gap-4', className)}>
      <div className="bg-card overflow-hidden rounded-lg border">
        <Table className="min-w-[860px] table-fixed">
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 pl-4"><span className="sr-only">Done</span></TableHead>
              <TableHead>Task</TableHead>
              <TableHead className="w-32">Status</TableHead>
              <TableHead className="w-32">Priority</TableHead>
              <TableHead className="w-32">Due</TableHead>
              <TableHead className="w-24 pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? <TableRow><TableCell colSpan={6} className="text-muted-foreground h-24 text-center">{emptyText}</TableCell></TableRow> : null}
            {tasks.map((t) => {
              const done = t.status === 'Done';
              return (
                <TableRow key={t.id}>
                  <TableCell className="pl-4"><Checkbox checked={done} onCheckedChange={() => onToggle && onToggle(t)} aria-label={(done ? 'Mark not done: ' : 'Mark complete: ') + t.title} className="size-5 rounded-full" /></TableCell>
                  <TableCell className="py-3">
                    <div className={cn('truncate font-medium', done && 'text-muted-foreground line-through')}>{t.title}</div>
                    <div className="text-muted-foreground truncate">{t.description}</div>
                  </TableCell>
                  <TableCell><TaskBadge status={t.status} /></TableCell>
                  <TableCell><TaskBadge priority={t.priority} /></TableCell>
                  <TableCell className={cn(t.dueToday && !done ? 'text-warning font-medium' : 'text-muted-foreground')}>{t.dueLabel || '\u2014'}</TableCell>
                  <TableCell className="pr-4 text-right">
                    <Button variant="ghost" size="icon-sm" aria-label={'Edit ' + t.title} onClick={() => onEdit && onEdit(t)}><Icon name="pencil" /></Button>
                    <Button variant="ghost" size="icon-sm" aria-label={'Delete ' + t.title} className="text-destructive hover:text-destructive" onClick={() => onDelete && onDelete(t)}><Icon name="trash-2" /></Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {footer ? <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-3 text-sm">{footer}</div> : null}
    </div>
  );
}
