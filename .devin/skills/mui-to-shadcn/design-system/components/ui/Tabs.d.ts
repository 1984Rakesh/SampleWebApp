import * as React from 'react';
type Div = React.HTMLAttributes<HTMLDivElement>;
/** shadcn Tabs. Also used as a segmented control (TabsList + TabsTrigger without TabsContent). */
export interface TabsProps extends Div { value?: string; defaultValue?: string; onValueChange?: (v: string) => void; }
export declare function Tabs(props: TabsProps): JSX.Element;
export declare function TabsList(props: Div): JSX.Element;
export declare function TabsTrigger(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }): JSX.Element;
export declare function TabsContent(props: Div & { value: string }): JSX.Element;
