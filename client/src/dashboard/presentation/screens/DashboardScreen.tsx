import { OctagonX } from 'lucide-react';
import { useDashboardViewModel } from '../hooks';
import { DashboardProgress, DashboardRecentTasks, DashboardStats } from '../components';
import { LoadingSpinner } from '../../../components/feedback';
import { Alert, AlertDescription } from '../../../components/ui';

const PAGE_CLASS = 'min-h-screen bg-background px-4 py-4 md:px-8 md:pt-10 md:pb-16';

export default function DashboardScreen() {
  const { dashboard, statusLabels, isLoading, errorMessage, toggleTaskStatus, links } = useDashboardViewModel();
  if (isLoading) return <main className={PAGE_CLASS}><LoadingSpinner size="lg" text="Loading dashboard..." /></main>;

  return (
    <main className={PAGE_CLASS}>
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{dashboard.eyebrow}</p>
            <h1 className="font-display text-[42px] leading-[46px] font-bold tracking-tight">{dashboard.greeting}</h1>
            <p className="text-muted-foreground">{dashboard.summary}</p>
          </div>
          {errorMessage && (
            <Alert variant="destructive">
              <OctagonX />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <DashboardStats counts={dashboard.counts} statusLabels={statusLabels} total={dashboard.total} dueToday={dashboard.dueToday} dueThisWeek={dashboard.dueThisWeek} />
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <DashboardRecentTasks tasks={dashboard.recentTasks} tasksHref={links.tasks} onToggle={toggleTaskStatus} />
            <DashboardProgress counts={dashboard.counts} statusLabels={statusLabels} total={dashboard.total} percent={dashboard.completionPercent} tasksHref={links.tasks} profileHref={links.profile} />
          </div>
        </div>
      </div>
    </main>
  );
}
