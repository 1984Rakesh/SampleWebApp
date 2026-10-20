import * as React from 'react';
/** Dashboard metric card (shadcn section-card pattern). */
export interface StatCardProps { label: string; value: React.ReactNode; caption?: string; tone?: 'done' | 'inprogress' | 'todo'; icon?: string; captionTone?: 'warning' | 'amber'; className?: string; style?: React.CSSProperties; }
export declare function StatCard(props: StatCardProps): JSX.Element;
