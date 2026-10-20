import * as React from 'react';
/** shadcn Checkbox (Radix API: checked / onCheckedChange). */
export interface CheckboxProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> { checked?: boolean; defaultChecked?: boolean; onCheckedChange?: (checked: boolean) => void; className?: string; }
export declare function Checkbox(props: CheckboxProps): JSX.Element;
