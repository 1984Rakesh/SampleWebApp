import * as React from 'react';
/** Pill-shaped header nav link. */
export interface NavPillProps { active?: boolean; href?: string; onClick?: (e: any) => void; children?: React.ReactNode; style?: React.CSSProperties; }
export declare function NavPill(props: NavPillProps): JSX.Element;
