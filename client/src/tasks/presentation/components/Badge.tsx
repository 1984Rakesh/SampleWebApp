import type { BadgeTone } from '../models/TaskListViewState';
import { UiChip } from '../../../components/ui';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
}

export default function Badge({ label, tone = 'neutral' }: BadgeProps) {
  return <UiChip label={label} tone={tone} />;
}
