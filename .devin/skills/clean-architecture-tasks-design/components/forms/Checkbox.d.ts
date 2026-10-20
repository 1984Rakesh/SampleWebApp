import * as React from 'react';
/** Round 22px completion checkbox. Checked = --done fill with check. */
export interface CheckboxProps { checked?: boolean; onChange?: (checked: boolean) => void; label: string; size?: number; disabled?: boolean; style?: React.CSSProperties; }
export declare function Checkbox(props: CheckboxProps): JSX.Element;
