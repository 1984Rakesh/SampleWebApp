import { useColorMode } from '../../foundation/theme';
import { UiCard, UiCardContent, UiStack, UiText, UiToggleGroup } from './ui';

const options = [{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: 'system', label: 'System' }];

export default function ProfileAppearance() {
  const { mode, setLightMode, setDarkMode, setSystemMode } = useColorMode();
  const updateMode = (value: string) => {
    if (value === 'light') setLightMode();
    else if (value === 'dark') setDarkMode();
    else setSystemMode();
  };
  return <UiCard><UiCardContent><UiStack spacing={1.5}><UiText variant="h6" as="h2" weight="bold">Appearance</UiText><UiText variant="body2" tone="muted">Choose how the app looks.</UiText><UiToggleGroup value={mode} options={options} onChange={updateMode} fullWidth /></UiStack></UiCardContent></UiCard>;
}
