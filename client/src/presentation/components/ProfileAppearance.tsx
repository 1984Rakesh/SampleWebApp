import { useColorMode } from '../../foundation/theme';
import { UiCard, UiCardContent, UiStack, UiText, UiToggleGroup } from './ui';

const options = [{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: 'system', label: 'System' }];

export default function ProfileAppearance() {
  const { mode, setLightMode, setDarkMode } = useColorMode();
  const updateMode = (value: string) => value === 'light' ? setLightMode() : setDarkMode();
  return <UiCard><UiCardContent><UiStack spacing={1.5}><UiText variant="h6" as="h2" weight="bold">Appearance</UiText><UiText variant="body2" tone="muted">Choose how Clean Architecture looks on this device.</UiText><UiToggleGroup value={mode} options={options} onChange={updateMode} disabledValues={['system']} fullWidth /></UiStack></UiCardContent></UiCard>;
}
