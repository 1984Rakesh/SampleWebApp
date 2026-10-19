import { useState } from 'react';
import { useDashboardViewModel } from '../hooks';
import DashboardProgress from '../components/DashboardProgress';
import DashboardRecentTasks from '../components/DashboardRecentTasks';
import DashboardStats from '../components/DashboardStats';
import LoadingSpinner from '../components/LoadingSpinner';
import TaskDialog from '../components/TaskDialog';
import { UiAlert, UiButton, UiFlex, UiGrid, UiGridItem, UiIcon, UiPage, UiScreen, UiText } from '../components/ui';

export default function DashboardScreen() {
  const { dashboard, isLoading, errorMessage, toggleTaskStatus } = useDashboardViewModel();
  const [dialogOpen, setDialogOpen] = useState(false);
  if (isLoading) return <UiPage><LoadingSpinner size="lg" text="Loading dashboard..." /></UiPage>;

  return (
    <UiScreen maxWidth="lg">
      <UiFlex justify="space-between" align="end" wrap gap={2} mb={4}>
        <UiFlex column gap={1}>
          <UiText variant="caption" tone="muted" weight="semibold">{dashboard.eyebrow}</UiText>
          <UiText variant="h4" as="h1" weight="bold">{dashboard.greeting}</UiText>
          <UiText tone="muted">{dashboard.summary}</UiText>
        </UiFlex>
        <UiButton variant="solid" startIcon={<UiIcon name="add" />} onClick={() => setDialogOpen(true)}>New task</UiButton>
      </UiFlex>
      {errorMessage && <UiAlert type="error" gutterBottom>{errorMessage}</UiAlert>}
      <DashboardStats counts={dashboard.counts} total={dashboard.total} dueToday={dashboard.dueToday} dueThisWeek={dashboard.dueThisWeek} />
      <UiGrid spacing={2}>
        <UiGridItem md={8}><DashboardRecentTasks tasks={dashboard.recentTasks} onToggle={toggleTaskStatus} /></UiGridItem>
        <UiGridItem md={4}><DashboardProgress counts={dashboard.counts} total={dashboard.total} percent={dashboard.completionPercent} /></UiGridItem>
      </UiGrid>
      {dialogOpen && <TaskDialog key="dashboard-create" open onClose={() => setDialogOpen(false)} />}
    </UiScreen>
  );
}
