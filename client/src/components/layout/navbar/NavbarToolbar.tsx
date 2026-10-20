import {
  UiAppBar, UiAvatar, UiButton, UiFlex, UiIconButton, UiNavButton, UiResponsive, UiText, UiToolbar,
} from '../../ui';
import { Logo } from '../../app/Logo';
import type { NavbarProps } from './NavbarViewState';

type Props = Pick<NavbarProps, 'view' | 'onOpenNavigation' | 'onToggleTheme' | 'onLogout' | 'onCreateTask'>;

export default function NavbarToolbar({ view, onOpenNavigation, onToggleTheme, onLogout, onCreateTask }: Props) {
  return (
    <UiAppBar>
      <UiToolbar>
        <UiIconButton icon="menu" ariaLabel="Open navigation" onClick={onOpenNavigation} hideFrom="md" />
        <UiFlex grow align="center" minWidth0 gap={1}>
          <UiButton to={view.brand.to} ariaLabel="Go to Dashboard" noShrink>
            <Logo name={view.brand.label} hideWordmarkBelow="sm" />
          </UiButton>
          <UiResponsive display="flex" hideBelow="md">
            <UiFlex gap={0.5} ml={1}>
              {view.links.map((link) => <UiNavButton key={link.to} to={link.to}>{link.label}</UiNavButton>)}
            </UiFlex>
          </UiResponsive>
        </UiFlex>
        <UiFlex align="center" gap={1}>
          <UiIconButton
            icon={view.mode === 'light' ? 'theme-dark' : 'theme-light'}
            ariaLabel="Toggle theme"
            tooltip={view.mode === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            onClick={onToggleTheme}
            bordered
          />
          <UiResponsive display="flex" hideBelow="md">
            <UiButton to={view.profilePath} variant="outline" ariaLabel="Open profile">
              <UiFlex align="center" gap={1}>
                <UiAvatar label={view.initial} size="sm" tone="primary" variant="solid" />
                <UiText variant="body2" weight="medium" noWrap maxWidth={180}>{view.userName}</UiText>
              </UiFlex>
            </UiButton>
          </UiResponsive>
          <UiIconButton icon="logout" ariaLabel="Log out" tooltip="Log out" onClick={onLogout} bordered />
          <UiIconButton icon="add" ariaLabel="New task" tooltip="New task" onClick={onCreateTask} variant="solid" tone="primary" />
        </UiFlex>
      </UiToolbar>
    </UiAppBar>
  );
}
