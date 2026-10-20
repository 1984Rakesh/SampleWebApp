import * as React from 'react';
/** shadcn Table parts. */
export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> { className?: string; }
export interface TablePartProps extends React.HTMLAttributes<HTMLElement> { className?: string; colSpan?: number; }
export declare function Table(props: TableProps): JSX.Element;
export declare function TableHeader(props: TablePartProps): JSX.Element;
export declare function TableBody(props: TablePartProps): JSX.Element;
export declare function TableFooter(props: TablePartProps): JSX.Element;
export declare function TableRow(props: TablePartProps): JSX.Element;
export declare function TableHead(props: TablePartProps): JSX.Element;
export declare function TableCell(props: TablePartProps): JSX.Element;
export declare function TableCaption(props: TablePartProps): JSX.Element;
