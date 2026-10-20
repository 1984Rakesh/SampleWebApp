import * as React from 'react';
/** App top bar: Logo, ghost nav buttons, theme toggle, profile pill, log out. Built on Button + Avatar. */
export interface AppHeaderProps { active?: string; items?: { key: string; label: string }[]; userName?: string; theme?: 'dark' | 'light'; onNavigate?: (key: string) => void; onToggleTheme?: () => void; onLogout?: () => void; sticky?: boolean; className?: string; }
export declare function AppHeader(props: AppHeaderProps): JSX.Element;
