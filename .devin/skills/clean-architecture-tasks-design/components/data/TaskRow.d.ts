import * as React from 'react';
/** Recent-tasks list row: checkbox, title, description, chips, due date. */
export interface TaskRowProps { task: { id?: string | number; title: string; description?: string; status: 'To do' | 'In progress' | 'Done'; priority: 'High' | 'Medium' | 'Low'; dueLabel?: string; dueToday?: boolean }; onToggle?: (task: any) => void; divider?: boolean; style?: React.CSSProperties; }
export declare function TaskRow(props: TaskRowProps): JSX.Element;
