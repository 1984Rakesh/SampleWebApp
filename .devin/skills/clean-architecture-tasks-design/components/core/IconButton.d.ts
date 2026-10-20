import * as React from 'react';
/** Icon-only button. `label` is required (aria-label). */
export interface IconButtonProps { icon: string; label: string; tone?: 'default' | 'danger'; variant?: 'outlined' | 'bare'; size?: number; iconSize?: number; onClick?: (e: any) => void; disabled?: boolean; style?: React.CSSProperties; }
export declare function IconButton(props: IconButtonProps): JSX.Element;
