import * as React from 'react';
/**
 * Modal dialog (540px, 24px radius) for New task / Edit task; Esc, backdrop and close button dismiss.
 */
export interface DialogProps { open?: boolean; onClose?: () => void; title: React.ReactNode; subtitle?: React.ReactNode; children?: React.ReactNode; actions?: React.ReactNode; maxWidth?: number; contained?: boolean; style?: React.CSSProperties; }
export declare function Dialog(props: DialogProps): JSX.Element;
