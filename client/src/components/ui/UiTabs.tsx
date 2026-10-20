import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import type { SelectOption } from './SelectOption';

interface UiTabsProps { value: string; options: SelectOption[]; onChange: (value: string) => void; ariaLabel: string }

export default function UiTabs({ value, options, onChange, ariaLabel }: UiTabsProps) {
  return <Tabs value={value} onChange={(_event, next: string) => onChange(next)} aria-label={ariaLabel} variant="scrollable" scrollButtons={false}>{options.map((option) => <Tab key={option.value} value={option.value} label={option.label} />)}</Tabs>;
}
