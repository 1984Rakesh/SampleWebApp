import type { DashboardStatusLabels, DashboardTaskCounts } from '../models/DashboardViewState';
import { StatCard } from '../../../components/app/StatCard';
import { UiGrid, UiGridItem } from '../../../components/ui';

interface DashboardStatsProps { counts: DashboardTaskCounts; statusLabels: DashboardStatusLabels; total: number; dueToday: number; dueThisWeek: number }

export default function DashboardStats({ counts, statusLabels, total, dueToday, dueThisWeek }: DashboardStatsProps) {
  return (
    <UiGrid spacing={2}>
      <UiGridItem sm={4}><StatCard label={statusLabels.completed} value={counts.completed} tone="done" caption={`${total ? Math.round((counts.completed / total) * 100) : 0}% of all tasks`} /></UiGridItem>
      <UiGridItem sm={4}><StatCard label={statusLabels.inProgress} value={counts.inProgress} tone="inprogress" caption={`${dueThisWeek} due this week`} /></UiGridItem>
      <UiGridItem sm={4}><StatCard label={statusLabels.todo} value={counts.todo} tone="todo" caption={`${dueToday} due today`} captionTone={dueToday > 0 ? 'warning' : undefined} /></UiGridItem>
    </UiGrid>
  );
}
