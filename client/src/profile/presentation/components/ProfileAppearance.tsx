import { useColorMode } from '../../../foundation/theme';
import { Card, CardAction, CardDescription, CardHeader, CardTitle, ToggleGroup, ToggleGroupItem } from '../../../components/ui';

const options = [{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: 'system', label: 'System' }];

export default function ProfileAppearance() {
  const { mode, setLightMode, setDarkMode, setSystemMode } = useColorMode();
  const updateMode = (value: string) => {
    if (value === 'light') setLightMode();
    else if (value === 'dark') setDarkMode();
    else setSystemMode();
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[22px] leading-7 tracking-tight">Appearance</CardTitle>
        <CardDescription>Choose how the app looks.</CardDescription>
        <CardAction>
          <ToggleGroup type="single" size="sm" value={mode} onValueChange={(value) => value && updateMode(value)} aria-label="Theme">
            {options.map((option) => <ToggleGroupItem key={option.value} value={option.value}>{option.label}</ToggleGroupItem>)}
          </ToggleGroup>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
