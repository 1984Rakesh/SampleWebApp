import type { DashboardTaskCounts } from '../models/DashboardViewState';
import { UiAvatar, UiCard, UiCardContent, UiCardHeader, UiFlex, UiIcon, UiProgress, UiSwatch, UiText } from '../../../components/ui';
import { TASK_STATUS_LABELS } from '@/lib/task-labels';

interface DashboardProgressProps { counts: DashboardTaskCounts; total: number; percent: number }

const legend = [
  { label: TASK_STATUS_LABELS.COMPLETED, swatch: 'chart-1' },
  { label: TASK_STATUS_LABELS.IN_PROGRESS, swatch: 'chart-2' },
  { label: TASK_STATUS_LABELS.TODO, swatch: 'chart-3' },
] as const;

export default function DashboardProgress({ counts, total, percent }: DashboardProgressProps) {
  const values = [counts.completed, counts.inProgress, counts.todo];
  return (
    <UiFlex column gap={2}>
      <UiCard>
        <UiCardHeader title="Overall progress" />
        <UiCardContent>
          <UiFlex column gap={2}>
            <UiFlex align="baseline" gap={1}>
              <UiText variant="h4" weight="bold">{percent}%</UiText>
              <UiText variant="body2" tone="muted">of {total} tasks done</UiText>
            </UiFlex>
            <UiProgress completed={counts.completed} inProgress={counts.inProgress} todo={counts.todo} />
            <UiFlex column gap={1}>
              {legend.map((item, index) => (
                <UiFlex key={item.label} justify="space-between" align="center">
                  <UiText variant="body2" tone="muted"><UiSwatch tone={item.swatch} />{item.label}</UiText>
                  <UiText variant="body2" weight="semibold">{values[index]}</UiText>
                </UiFlex>
              ))}
            </UiFlex>
          </UiFlex>
        </UiCardContent>
      </UiCard>
      <UiCard to="/tasks"><UiCardContent><UiFlex align="center" gap={2}><UiAvatar icon="list" tone="info" size="sm" shape="square" /><UiFlex column grow minWidth0><UiText weight="semibold">Manage tasks</UiText><UiText variant="body2" tone="muted">Create, edit and organize</UiText></UiFlex><UiIcon name="chevron-right" /></UiFlex></UiCardContent></UiCard>
      <UiCard to="/profile"><UiCardContent><UiFlex align="center" gap={2}><UiAvatar icon="person" tone="muted" size="sm" shape="square" /><UiFlex column grow minWidth0><UiText weight="semibold">Your profile</UiText><UiText variant="body2" tone="muted">Update your details</UiText></UiFlex><UiIcon name="chevron-right" /></UiFlex></UiCardContent></UiCard>
    </UiFlex>
  );
}
