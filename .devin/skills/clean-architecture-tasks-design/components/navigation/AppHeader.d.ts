import * as React from 'react';
/**
 * Shared app bar on every screen: logo, Dashboard/Tasks/Profile/Comparison nav, theme toggle, user pill, logout.
 */
export interface AppHeaderProps { active?: string; items?: Array<{ key: string; label: string }>; userName?: string; theme?: 'light' | 'dark'; onNavigate?: (key: string) => void; onToggleTheme?: () => void; onLogout?: () => void; sticky?: boolean; style?: React.CSSProperties; }
export declare function AppHeader(props: AppHeaderProps): JSX.Element;
