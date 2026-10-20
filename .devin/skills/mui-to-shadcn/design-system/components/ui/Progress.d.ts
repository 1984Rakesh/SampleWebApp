import * as React from 'react';
/** shadcn Progress, value 0–100. For the status breakdown use TaskProgress. */
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> { value?: number; className?: string; }
export declare function Progress(props: ProgressProps): JSX.Element;
