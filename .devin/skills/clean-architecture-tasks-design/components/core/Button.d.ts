import * as React from 'react';
/** Text button. Primary = accent fill; outlined = Cancel / Previous / Next. */
export interface ButtonProps { variant?: 'primary' | 'outlined' | 'text'; size?: 'md' | 'sm'; startIcon?: string; endIcon?: string; disabled?: boolean; fullWidth?: boolean; href?: string; type?: 'button' | 'submit'; onClick?: (e: any) => void; children?: React.ReactNode; style?: React.CSSProperties; }
export declare function Button(props: ButtonProps): JSX.Element;
