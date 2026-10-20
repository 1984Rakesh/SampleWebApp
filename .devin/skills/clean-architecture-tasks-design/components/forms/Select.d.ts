import * as React from 'react';
/** Native select styled as a 44px toolbar control. */
export interface SelectProps { value?: string; onChange?: (value: string, e: any) => void; options?: Array<string | { value: string; label: string }>; label?: string; style?: React.CSSProperties; }
export declare function Select(props: SelectProps): JSX.Element;
