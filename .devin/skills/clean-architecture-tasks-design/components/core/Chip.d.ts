import * as React from 'react';
/** Tinted pill for priority and status. Label always shown. */
export interface ChipProps { priority?: 'High' | 'Medium' | 'Low'; status?: 'To do' | 'In progress' | 'Done'; tone?: 'high' | 'medium' | 'low' | 'todo' | 'inprogress' | 'done' | 'neutral'; dot?: boolean; children?: React.ReactNode; style?: React.CSSProperties; }
export declare function Chip(props: ChipProps): JSX.Element;
