import * as React from 'react';
import { Task } from './TaskRow';
/** Tasks data table on shadcn Table, with edit/delete ghost actions and a footer slot for pagination. */
export interface TaskTableProps { tasks: Task[]; onToggle?: (t: Task) => void; onEdit?: (t: Task) => void; onDelete?: (t: Task) => void; footer?: React.ReactNode; emptyText?: string; className?: string; }
export declare function TaskTable(props: TaskTableProps): JSX.Element;
