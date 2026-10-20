export interface NavigationLink {
  to: string;
  label: string;
}

export interface NavbarViewState {
  userName: string;
  initial: string;
  mode: 'light' | 'dark';
  links: NavigationLink[];
  brand: { label: string; mark: string; to: string };
  profilePath: string;
}

export interface NavbarProps {
  view: NavbarViewState;
  drawerOpen: boolean;
  onOpenNavigation: () => void;
  onCloseNavigation: () => void;
  onToggleTheme: () => void;
  onLogout: () => void;
  onCreateTask: () => void;
}
