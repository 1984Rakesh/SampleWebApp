import * as React from 'react';
/** Lucide icon (preview shim). Default size-4; size via className (size-3.5, size-5) or the size prop. Production: lucide-react. */
export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> { name: string; size?: number; label?: string; className?: string; }
export declare function Icon(props: IconProps): JSX.Element;
