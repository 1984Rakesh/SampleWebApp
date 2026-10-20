import NavbarToolbar from './navbar/NavbarToolbar';
import NavbarDrawer from './navbar/NavbarDrawer';
import type { NavbarProps } from './navbar/NavbarViewState';

export default function Navbar(props: NavbarProps) {
  return (
    <>
      <NavbarToolbar
        view={props.view}
        onOpenNavigation={props.onOpenNavigation}
        onToggleTheme={props.onToggleTheme}
        onLogout={props.onLogout}
        onCreateTask={props.onCreateTask}
      />
      <NavbarDrawer view={props.view} open={props.drawerOpen} onClose={props.onCloseNavigation} />
    </>
  );
}
