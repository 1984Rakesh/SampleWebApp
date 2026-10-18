import { useAuthViewModel, useTaskListViewModel, useUserViewModel } from '../hooks';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  UiAvatar,
  UiCard,
  UiCardContent,
  UiFlex,
  UiGrid,
  UiGridItem,
  UiPage,
  UiScreen,
  UiText,
} from '../components/ui';
import type { UiIconName } from '../components/ui';

interface StatItem {
  label: string;
  value: number;
  icon: UiIconName;
  tone: 'success' | 'info' | 'muted';
}

interface QuickAction {
  to: string;
  title: string;
  description: string;
  icon: UiIconName;
}

export default function DashboardScreen() {
  const { userName } = useAuthViewModel();
  const { profile, isLoading: userLoading } = useUserViewModel();
  const { taskItems, counts, isLoading: tasksLoading, deleteTask, toggleTaskStatus } = useTaskListViewModel();

  const recentTasks = taskItems.slice(0, 3);

  if (userLoading || tasksLoading) {
    return (
      <UiPage>
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </UiPage>
    );
  }

  const stats: StatItem[] = [
    { label: 'Completed', value: counts.completed, icon: 'check-circle', tone: 'success' },
    { label: 'In Progress', value: counts.inProgress, icon: 'hourglass', tone: 'info' },
    { label: 'To Do', value: counts.todo, icon: 'list', tone: 'muted' },
  ];

  const quickActions: QuickAction[] = [
    { to: '/tasks', title: 'Manage Tasks', description: 'Create, edit, and organize your tasks', icon: 'task' },
    { to: '/profile', title: 'View Profile', description: 'Update your profile information', icon: 'profile' },
  ];

  return (
    <UiScreen maxWidth="lg">
      <UiFlex column mb={4}>
        <UiText variant="h4" as="h1" weight="bold" gutterBottom>
          Welcome back, {profile?.name || userName || 'User'}!
        </UiText>
        <UiText tone="muted">
          Here's an overview of your tasks and progress.
        </UiText>
      </UiFlex>

      <UiGrid spacing={3} mb={4}>
        {stats.map((stat) => (
          <UiGridItem key={stat.label} md={4}>
            <UiCard>
              <UiCardContent>
                <UiFlex align="center" justify="space-between">
                  <UiFlex column>
                    <UiText tone="muted" variant="body2">
                      {stat.label}
                    </UiText>
                    <UiText variant="h4" weight="bold">
                      {stat.value}
                    </UiText>
                  </UiFlex>
                  <UiAvatar icon={stat.icon} tone={stat.tone} />
                </UiFlex>
              </UiCardContent>
            </UiCard>
          </UiGridItem>
        ))}
      </UiGrid>

      <UiGrid spacing={3} mb={4}>
        {quickActions.map((action) => (
          <UiGridItem key={action.to} md={6}>
            <UiCard to={action.to}>
              <UiCardContent>
                <UiFlex align="center" gap={2}>
                  <UiAvatar icon={action.icon} tone="primary" />
                  <UiFlex column>
                    <UiText variant="h6" weight="semibold">
                      {action.title}
                    </UiText>
                    <UiText tone="muted" variant="body2">
                      {action.description}
                    </UiText>
                  </UiFlex>
                </UiFlex>
              </UiCardContent>
            </UiCard>
          </UiGridItem>
        ))}
      </UiGrid>

      <UiCard>
        <UiCardContent>
          <UiText variant="h6" weight="bold" gutterBottom>
            Recent Tasks
          </UiText>
          {recentTasks.length > 0 ? (
            <UiFlex column gap={1.5}>
              {recentTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={deleteTask}
                  onToggleStatus={toggleTaskStatus}
                />
              ))}
            </UiFlex>
          ) : (
            <UiText tone="muted">
              No tasks yet. Create your first task!
            </UiText>
          )}
        </UiCardContent>
      </UiCard>
    </UiScreen>
  );
}
