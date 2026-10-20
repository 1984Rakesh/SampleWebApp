import * as React from 'react';
export interface Task { id: string | number; title: string; description?: string; status: 'To do' | 'In progress' | 'Done'; priority: 'High' | 'Medium' | 'Low'; dueLabel?: string; dueToday?: boolean; }
/** Task list row for cards: round Checkbox, title, description, TaskBadges, due date. */
export interface TaskRowProps { task: Task; onToggle?: (t: Task) => void; divider?: boolean; className?: string; style?: React.CSSProperties; }
export declare function TaskRow(props: TaskRowProps): JSX.Element;
