import * as React from 'react';
/** shadcn Dialog: Dialog > DialogContent > DialogHeader (DialogTitle, DialogDescription), body, DialogFooter. */
export interface DialogProps { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; children?: React.ReactNode; }
export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> { showCloseButton?: boolean; className?: string; }
export declare function Dialog(props: DialogProps): JSX.Element;
export declare function DialogTrigger(props: { children: React.ReactElement }): JSX.Element;
export declare function DialogClose(props: { children: React.ReactElement }): JSX.Element;
export declare function DialogContent(props: DialogContentProps): JSX.Element | null;
export declare function DialogHeader(props: React.HTMLAttributes<HTMLDivElement>): JSX.Element;
export declare function DialogFooter(props: React.HTMLAttributes<HTMLDivElement>): JSX.Element;
export declare function DialogTitle(props: React.HTMLAttributes<HTMLHeadingElement>): JSX.Element;
export declare function DialogDescription(props: React.HTMLAttributes<HTMLParagraphElement>): JSX.Element;
