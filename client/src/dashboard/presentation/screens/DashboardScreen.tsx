import { useDashboardViewModel } from '../hooks';
import DashboardProgress from '../components/DashboardProgress';
import DashboardRecentTasks from '../components/DashboardRecentTasks';
import DashboardStats from '../components/DashboardStats';
import LoadingSpinner from '../../../components/feedback/LoadingSpinner';
import { UiAlert, UiAsideGrid, UiFlex, UiPage, UiScreen, UiText } from '../../../components/ui';

export default function DashboardScreen() {
  const { dashboard, isLoading, errorMessage, toggleTaskStatus } = useDashboardViewModel();
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
        <DashboardStats counts={dashboard.counts} total={dashboard.total} dueToday={dashboard.dueToday} dueThisWeek={dashboard.dueThisWeek} />
        <UiAsideGrid template="rail" gap={3}>
          <DashboardRecentTasks tasks={dashboard.recentTasks} onToggle={toggleTaskStatus} />
          <DashboardProgress counts={dashboard.counts} total={dashboard.total} percent={dashboard.completionPercent} />
        </UiAsideGrid>
      </UiFlex>
    </UiScreen>
  );
}
