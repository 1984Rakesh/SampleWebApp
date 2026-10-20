import { cn } from '@/lib/utils';

const toneMap = {
  'status-progress': 'bg-status-progress text-status-progress-foreground',
  'status-done': 'bg-status-done text-status-done-foreground',
  'priority-medium': 'bg-priority-medium text-priority-medium-foreground',
  'priority-low': 'bg-priority-low text-priority-low-foreground',
} as const;

interface UiTonePanelProps {
  tone: keyof typeof toneMap;
  title: string;
  description?: string;
}

// Soft status/priority-toned title block used by the comparison layer map.
export default function UiTonePanel({ tone, title, description }: UiTonePanelProps) {
  return (
    <div className={cn('mb-2 flex flex-col rounded p-3', toneMap[tone])}>
      <span className="font-semibold">{title}</span>
      {description && <span className="text-sm opacity-90">{description}</span>}
    </div>
  );
}
