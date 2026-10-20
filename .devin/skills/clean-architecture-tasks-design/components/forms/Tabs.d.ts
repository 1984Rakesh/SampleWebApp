import * as React from 'react';
/** Boxed tab strip with counts (status filter). */
export interface TabsProps { items?: Array<{ value: string; label: string; count?: number }>; value?: string; onChange?: (value: string) => void; label?: string; style?: React.CSSProperties; }
export declare function Tabs(props: TabsProps): JSX.Element;
