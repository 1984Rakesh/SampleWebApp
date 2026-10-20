import * as React from 'react';
/**
 * Dashboard stat card: label, tinted 36px icon tile, 48px number, caption.
 */
export interface StatCardProps { label: string; value: React.ReactNode; caption?: string; tone?: 'done' | 'inprogress' | 'todo'; icon?: string; captionTone?: 'amber'; style?: React.CSSProperties; }
export declare function StatCard(props: StatCardProps): JSX.Element;
