import type { DashboardTaskCounts } from '../models/DashboardViewState';
import { StatCard } from '../../../components/app/StatCard';
import { UiGrid, UiGridItem } from '../../../components/ui';
import { TASK_STATUS_LABELS } from '@/lib/task-labels';

interface DashboardStatsProps { counts: DashboardTaskCounts; total: number; dueToday: number; dueThisWeek: number }

export default function DashboardStats({ counts, total, dueToday, dueThisWeek }: DashboardStatsProps) {
  return (
    <UiGrid spacing={2}>
      <UiGridItem sm={4}><StatCard label={TASK_STATUS_LABELS.COMPLETED} value={counts.completed} tone="done" caption={`${total ? Math.round((counts.completed / total) * 100) : 0}% of all tasks`} /></UiGridItem>
      <UiGridItem sm={4}><StatCard label={TASK_STATUS_LABELS.IN_PROGRESS} value={counts.inProgress} tone="inprogress" caption={`${dueThisWeek} due this week`} /></UiGridItem>
      <UiGridItem sm={4}><StatCard label={TASK_STATUS_LABELS.TODO} value={counts.todo} tone="todo" caption={`${dueToday} due today`} captionTone={dueToday > 0 ? 'warning' : undefined} /></UiGridItem>
    </UiGrid>
  );
}
