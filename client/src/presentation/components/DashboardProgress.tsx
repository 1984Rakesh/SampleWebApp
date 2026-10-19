import type { TaskCountsViewState } from '../models/TaskListViewState';
import { UiAvatar, UiCard, UiCardContent, UiFlex, UiIcon, UiProgress, UiText } from './ui';

interface DashboardProgressProps { counts: TaskCountsViewState; total: number; percent: number }

export default function DashboardProgress({ counts, total, percent }: DashboardProgressProps) {
  const items = [
    { label: 'Completed', value: counts.completed, color: '#8FE3A8' },
    { label: 'In progress', value: counts.inProgress, color: '#8C9EFF' },
    { label: 'To do', value: counts.todo, color: '#3A4458' },
  ];
  return (
    <UiFlex column gap={2}>
      <UiCard><UiCardContent><UiText variant="h6" as="h2" weight="bold">Overall progress</UiText><UiFlex align="baseline" gap={1} mt={2} mb={2}><UiText variant="h4" weight="bold">{percent}%</UiText><UiText variant="body2" tone="muted">of {total} tasks done</UiText></UiFlex><UiProgress completed={counts.completed} inProgress={counts.inProgress} todo={counts.todo} /><UiFlex column gap={1} mt={2}>{items.map((item) => <UiFlex key={item.label} justify="space-between"><UiText variant="body2" tone="muted"><span style={{ color: item.color }}>■</span> {item.label}</UiText><UiText variant="body2" weight="semibold">{item.value}</UiText></UiFlex>)}</UiFlex></UiCardContent></UiCard>
      <UiCard to="/tasks"><UiCardContent><UiFlex align="center" gap={2}><UiAvatar icon="list" tone="info" size="sm" shape="square" /><UiFlex column grow minWidth0><UiText weight="semibold">Manage tasks</UiText><UiText variant="body2" tone="muted">Create, edit and organize</UiText></UiFlex><UiIcon name="chevron-right" /></UiFlex></UiCardContent></UiCard>
      <UiCard to="/profile"><UiCardContent><UiFlex align="center" gap={2}><UiAvatar icon="person" tone="muted" size="sm" shape="square" /><UiFlex column grow minWidth0><UiText weight="semibold">Your profile</UiText><UiText variant="body2" tone="muted">Update your details</UiText></UiFlex><UiIcon name="chevron-right" /></UiFlex></UiCardContent></UiCard>
    </UiFlex>
  );
}
