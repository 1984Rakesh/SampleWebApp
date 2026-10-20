import * as React from 'react';
/** shadcn Badge. For task status/priority use TaskBadge. */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> { variant?: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string; }
export declare function Badge(props: BadgeProps): JSX.Element;
