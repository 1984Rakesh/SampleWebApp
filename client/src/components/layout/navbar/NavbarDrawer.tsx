import { UiDivider, UiDrawer, UiFlex, UiNavList, UiText } from '../../ui';
import type { NavbarViewState } from './NavbarViewState';

interface Props {
  view: NavbarViewState;
  open: boolean;
  onClose: () => void;
}

export default function NavbarDrawer({ view, open, onClose }: Props) {
  return (
    <UiDrawer open={open} onClose={onClose}>
      <UiFlex column p={2.5} gap={0.5}>
        <UiText variant="h6" weight="semibold">Navigation</UiText>
        <UiText variant="body2" tone="muted" noWrap>{view.userName}</UiText>
      </UiFlex>
      <UiDivider />
      <UiNavList items={view.links.map((link) => ({ ...link, onClick: onClose }))} />
    </UiDrawer>
  );
}
