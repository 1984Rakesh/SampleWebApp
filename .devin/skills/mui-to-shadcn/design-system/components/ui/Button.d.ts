import * as React from 'react';
/** shadcn Button. Put <Icon> children before/after the label. */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'; size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'; href?: string; className?: string; }
export declare function Button(props: ButtonProps): JSX.Element;
