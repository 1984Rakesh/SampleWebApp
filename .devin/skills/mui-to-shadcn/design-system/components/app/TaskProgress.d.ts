import * as React from 'react';
/** Segmented status bar (chart-1..3) with optional legend. */
export interface TaskProgressProps { segments: { label: string; value: number; className?: string }[]; legend?: boolean; label?: string; className?: string; }
export declare function TaskProgress(props: TaskProgressProps): JSX.Element;
