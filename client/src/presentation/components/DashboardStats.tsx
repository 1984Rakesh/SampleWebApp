import type { TaskCountsViewState } from '../models/TaskListViewState';
import { UiAvatar, UiCard, UiCardContent, UiGrid, UiGridItem, UiText, UiFlex } from './ui';
import type { UiIconName } from './ui';

interface DashboardStatsProps { counts: TaskCountsViewState; total: number; dueToday: number; dueThisWeek: number }

export default function DashboardStats({ counts, total, dueToday, dueThisWeek }: DashboardStatsProps) {
  const stats: Array<{ label: string; value: number; icon: UiIconName; tone: 'success' | 'info' | 'muted'; caption: string; accent?: boolean }> = [
    { label: 'Completed', value: counts.completed, icon: 'check-circle', tone: 'success', caption: `${total ? Math.round((counts.completed / total) * 100) : 0}% of all tasks` },
    { label: 'In progress', value: counts.inProgress, icon: 'hourglass', tone: 'info', caption: `${dueThisWeek} due this week` },
    { label: 'To do', value: counts.todo, icon: 'list', tone: 'muted', caption: `${dueToday} due today`, accent: dueToday > 0 },
  ];
  return (
    <UiGrid spacing={2} mb={3}>
      {stats.map((stat) => (
        <UiGridItem key={stat.label} md={4}>
          <UiCard><UiCardContent><UiFlex justify="space-between" align="start"><UiText tone="muted" variant="body2" weight="medium">{stat.label}</UiText><UiAvatar icon={stat.icon} tone={stat.tone} size="sm" /></UiFlex><UiText variant="h4" weight="bold" mt={2}>{stat.value}</UiText><UiText variant="body2" tone={stat.accent ? 'accent' : 'muted'} weight={stat.accent ? 'semibold' : 'regular'} mt={1}>{stat.caption}</UiText></UiCardContent></UiCard>
        </UiGridItem>
      ))}
    </UiGrid>
  );
}
