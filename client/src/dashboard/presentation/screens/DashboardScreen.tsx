import { useDashboardViewModel } from '../hooks';
import { DashboardProgress, DashboardRecentTasks, DashboardStats } from '../components';
import { LoadingSpinner } from '../../../components/feedback';
import { UiAlert, UiAsideGrid, UiFlex, UiPage, UiScreen, UiText } from '../../../components/ui';

export default function DashboardScreen() {
  const { dashboard, statusLabels, isLoading, errorMessage, toggleTaskStatus } = useDashboardViewModel();
  if (isLoading) return <UiPage><LoadingSpinner size="lg" text="Loading dashboard..." /></UiPage>;

  return (
    <UiScreen maxWidth="6xl">
      <UiFlex column gap={4}>
        <UiFlex column gap={1}>
          <UiText variant="caption" tone="muted" weight="semibold">{dashboard.eyebrow}</UiText>
          <UiText variant="pageTitle">{dashboard.greeting}</UiText>
          <UiText tone="muted">{dashboard.summary}</UiText>
        </UiFlex>
        {errorMessage && <UiAlert type="error" gutterBottom>{errorMessage}</UiAlert>}
        <DashboardStats counts={dashboard.counts} statusLabels={statusLabels} total={dashboard.total} dueToday={dashboard.dueToday} dueThisWeek={dashboard.dueThisWeek} />
        <UiAsideGrid template="rail" gap={3}>
          <DashboardRecentTasks tasks={dashboard.recentTasks} onToggle={toggleTaskStatus} />
          <DashboardProgress counts={dashboard.counts} statusLabels={statusLabels} total={dashboard.total} percent={dashboard.completionPercent} />
        </UiAsideGrid>
      </UiFlex>
    </UiScreen>
  );
}
