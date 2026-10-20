import type { TaskCountsViewState } from '../../tasks/presentation/models/TaskListViewState';
import { UiAvatar, UiCard, UiCardContent, UiGrid, UiGridItem, UiText, UiFlex } from '../../components/ui';
import type { UiIconName } from '../../components/ui';

interface DashboardStatsProps { counts: TaskCountsViewState; total: number; dueToday: number; dueThisWeek: number }

export default function DashboardStats({ counts, total, dueToday, dueThisWeek }: DashboardStatsProps) {
  const stats: Array<{ label: string; value: number; icon: UiIconName; tone: 'success' | 'info' | 'muted'; caption: string; captionTone?: 'accent' | 'amber' | 'muted' }> = [
    { label: 'Completed', value: counts.completed, icon: 'check-circle', tone: 'success', caption: `${total ? Math.round((counts.completed / total) * 100) : 0}% of all tasks` },
    { label: 'In progress', value: counts.inProgress, icon: 'hourglass', tone: 'info', caption: `${dueThisWeek} due this week` },
    { label: 'To do', value: counts.todo, icon: 'list', tone: 'muted', caption: `${dueToday} due today`, captionTone: dueToday > 0 ? 'amber' : 'muted' },
  ];
  return (
    <UiGrid spacing={2} mb={3}>
      {stats.map((stat) => (
        <UiGridItem key={stat.label} md={4}>
          <UiCard><UiCardContent><UiFlex justify="space-between" align="start"><UiText tone="muted" variant="body2" weight="medium">{stat.label}</UiText><UiAvatar icon={stat.icon} tone={stat.tone} size="sm" shape="square" /></UiFlex><UiText variant="h1" as="p" weight="bold" mt={2}>{stat.value}</UiText><UiText variant="body2" tone={stat.captionTone ?? 'muted'} weight={stat.captionTone && stat.captionTone !== 'muted' ? 'semibold' : 'regular'} mt={1}>{stat.caption}</UiText></UiCardContent></UiCard>
        </UiGridItem>
      ))}
    </UiGrid>
  );
}
