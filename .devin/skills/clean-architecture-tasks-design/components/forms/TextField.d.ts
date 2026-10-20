import * as React from 'react';
/** Labelled input / textarea. Label sits above; focus = accent border. */
export interface TextFieldProps { label?: string; required?: boolean; value?: string; defaultValue?: string; onChange?: (value: string, e: any) => void; placeholder?: string; multiline?: boolean; rows?: number; startIcon?: string; endIcon?: string; readOnly?: boolean; disabled?: boolean; variant?: 'default' | 'toolbar'; type?: string; id?: string; inputRef?: any; autoFocus?: boolean; style?: React.CSSProperties; }
export declare function TextField(props: TextFieldProps): JSX.Element;
