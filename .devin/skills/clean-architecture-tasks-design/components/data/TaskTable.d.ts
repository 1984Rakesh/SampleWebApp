import * as React from 'react';
/**
 * Full tasks table in a bordered card with checkbox, chips, due, edit/delete actions and an optional footer.
 */
export interface TaskTableProps { tasks?: Array<{ id: string | number; title: string; description?: string; status: 'To do' | 'In progress' | 'Done'; priority: 'High' | 'Medium' | 'Low'; dueLabel?: string; dueToday?: boolean }>; onToggle?: (task: any) => void; onEdit?: (task: any) => void; onDelete?: (task: any) => void; footer?: React.ReactNode; emptyText?: string; style?: React.CSSProperties; }
export declare function TaskTable(props: TaskTableProps): JSX.Element;
