import * as React from 'react';
/** 10px stacked bar (Completed / In progress / To do) with optional legend. */
export interface ProgressBarProps { segments?: Array<{ label: string; value: number; color?: string }>; height?: number; legend?: boolean; label?: string; style?: React.CSSProperties; }
export declare function ProgressBar(props: ProgressBarProps): JSX.Element;
