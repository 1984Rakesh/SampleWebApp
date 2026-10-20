import * as React from 'react';
/** Avatar + full name pill linking to Profile. */
export interface UserPillProps { name?: string; href?: string; onClick?: (e: any) => void; style?: React.CSSProperties; }
export declare function UserPill(props: UserPillProps): JSX.Element;
