import * as React from 'react';
/** Bordered paper surface. 20px radius, 1px --border-card, --shadow-card (light only). */
export interface CardProps { padding?: number | string; radius?: number; as?: string; children?: React.ReactNode; style?: React.CSSProperties; }
export declare function Card(props: CardProps): JSX.Element;
