import * as React from 'react';
/** shadcn Select: Select > SelectTrigger > SelectValue, SelectContent > SelectItem. */
export interface SelectProps { value?: string; defaultValue?: string; onValueChange?: (v: string) => void; disabled?: boolean; className?: string; children?: React.ReactNode; }
export declare function Select(props: SelectProps): JSX.Element;
export declare function SelectTrigger(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { size?: 'default' | 'sm' }): JSX.Element;
export declare function SelectValue(props: { placeholder?: React.ReactNode; className?: string }): JSX.Element;
export declare function SelectContent(props: { align?: 'start' | 'end'; className?: string; children?: React.ReactNode }): JSX.Element;
export declare function SelectItem(props: { value: string; disabled?: boolean; className?: string; children?: React.ReactNode }): JSX.Element;
