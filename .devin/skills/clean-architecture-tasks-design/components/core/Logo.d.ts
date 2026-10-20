import * as React from 'react';
/** App logo: 32px accent square with a check + "Clean Architecture" wordmark. */
export interface LogoProps { name?: string; showWordmark?: boolean; size?: number; href?: string; onClick?: () => void; style?: React.CSSProperties; }
export declare function Logo(props: LogoProps): JSX.Element;
