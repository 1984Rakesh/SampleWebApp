import { useColorMode } from '../../../foundation/theme';
import { UiCard, UiCardHeader, UiToggleGroup } from '../../../components/ui';

const options = [{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: 'system', label: 'System' }];

export default function ProfileAppearance() {
  const { mode, setLightMode, setDarkMode, setSystemMode } = useColorMode();
  const updateMode = (value: string) => {
    if (value === 'light') setLightMode();
    else if (value === 'dark') setDarkMode();
    else setSystemMode();
  };
  return (
    <UiCard>
      <UiCardHeader
        title="Appearance"
        subtitle="Choose how the app looks."
        action={<UiToggleGroup value={mode} options={options} onChange={updateMode} ariaLabel="Theme" />}
      />
    </UiCard>
  );
}
