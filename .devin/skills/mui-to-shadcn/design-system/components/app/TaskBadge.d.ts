import * as React from 'react';
/** Badge tinted by task status or priority. Pass one of status / priority. */
export interface TaskBadgeProps { status?: 'To do' | 'In progress' | 'Done'; priority?: 'High' | 'Medium' | 'Low'; className?: string; children?: React.ReactNode; }
export declare function TaskBadge(props: TaskBadgeProps): JSX.Element;
