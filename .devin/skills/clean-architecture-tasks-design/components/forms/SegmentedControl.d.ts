import * as React from 'react';
/** Single-choice segmented control. `tinted` colors High/Medium/Low with chip colors. */
export interface SegmentedControlProps { options?: Array<string | { value: string; label: string }>; value?: string; onChange?: (value: string) => void; label?: string; tinted?: boolean; fullWidth?: boolean; style?: React.CSSProperties; }
export declare function SegmentedControl(props: SegmentedControlProps): JSX.Element;
