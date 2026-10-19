import { useDashboardViewModel } from '../hooks';
import DashboardProgress from '../components/DashboardProgress';
import DashboardRecentTasks from '../components/DashboardRecentTasks';
import DashboardStats from '../components/DashboardStats';
import LoadingSpinner from '../components/LoadingSpinner';
import { UiAlert, UiFlex, UiGrid, UiGridItem, UiPage, UiScreen, UiText } from '../components/ui';

export default function DashboardScreen() {
  const { dashboard, isLoading, errorMessage, toggleTaskStatus } = useDashboardViewModel();
  if (isLoading) return <UiPage><LoadingSpinner size="lg" text="Loading dashboard..." /></UiPage>;

  return (
    <UiScreen maxWidth="lg">
      <UiFlex column gap={1} mb={4}>
        <UiText variant="caption" tone="muted" weight="semibold">{dashboard.eyebrow}</UiText>
        <UiText variant="h4" as="h1" weight="bold">{dashboard.greeting}</UiText>
        <UiText tone="muted">{dashboard.summary}</UiText>
      </UiFlex>
      {errorMessage && <UiAlert type="error" gutterBottom>{errorMessage}</UiAlert>}
      <DashboardStats counts={dashboard.counts} total={dashboard.total} dueToday={dashboard.dueToday} dueThisWeek={dashboard.dueThisWeek} />
      <UiGrid spacing={2}>
        <UiGridItem md={8}><DashboardRecentTasks tasks={dashboard.recentTasks} onToggle={toggleTaskStatus} /></UiGridItem>
        <UiGridItem md={4}><DashboardProgress counts={dashboard.counts} total={dashboard.total} percent={dashboard.completionPercent} /></UiGridItem>
      </UiGrid>
    </UiScreen>
  );
}
