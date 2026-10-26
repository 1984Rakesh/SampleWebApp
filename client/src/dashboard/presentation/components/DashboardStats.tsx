import type { DashboardStatusLabels, DashboardTaskCounts } from '../models';
import { StatCard } from '../../../components/app';

interface DashboardStatsProps { counts: DashboardTaskCounts; statusLabels: DashboardStatusLabels; total: number; dueToday: number; dueThisWeek: number }

export default function DashboardStats({ counts, statusLabels, total, dueToday, dueThisWeek }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard label={statusLabels.completed} value={counts.completed} tone="done" caption={`${total ? Math.round((counts.completed / total) * 100) : 0}% of all tasks`} />
      <StatCard label={statusLabels.inProgress} value={counts.inProgress} tone="inprogress" caption={`${dueThisWeek} due this week`} />
      <StatCard label={statusLabels.todo} value={counts.todo} tone="todo" caption={`${dueToday} due today`} captionTone={dueToday > 0 ? 'warning' : undefined} />
    </div>
  );
}
