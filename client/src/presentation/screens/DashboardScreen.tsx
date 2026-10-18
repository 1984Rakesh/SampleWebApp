import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Avatar from '@mui/material/Avatar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TaskIcon from '@mui/icons-material/Task';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuthViewModel, useTaskListViewModel, useUserViewModel } from '../hooks';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DashboardScreen() {
  const { userName } = useAuthViewModel();
  const { profile, isLoading: userLoading } = useUserViewModel();
  const { taskItems, counts, isLoading: tasksLoading, deleteTask, toggleTaskStatus } = useTaskListViewModel();

  const recentTasks = taskItems.slice(0, 3);

  if (userLoading || tasksLoading) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="background.default" p={4}>
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </Box>
    );
  }

  const stats = [
    { label: 'Completed', value: counts.completed, icon: CheckCircleIcon, color: 'success' as const },
    { label: 'In Progress', value: counts.inProgress, icon: HourglassEmptyIcon, color: 'info' as const },
    { label: 'To Do', value: counts.todo, icon: ListAltIcon, color: 'default' as const },
  ];

  const quickActions = [
    { to: '/tasks', title: 'Manage Tasks', description: 'Create, edit, and organize your tasks', icon: TaskIcon },
    { to: '/profile', title: 'View Profile', description: 'Update your profile information', icon: AccountCircleIcon },
  ];

  return (
    <Box minHeight="100vh" bgcolor="background.default" p={{ xs: 2, md: 4 }}>
      <Container maxWidth="lg">
        <Box mb={4}>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            Welcome back, {profile?.name || userName || 'User'}!
          </Typography>
          <Typography color="text.secondary">
            Here's an overview of your tasks and progress.
          </Typography>
        </Box>

        <Grid container spacing={3} mb={4}>
          {stats.map((stat) => (
            <Grid key={stat.label} size={{ xs: 12, md: 4 }}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="text.secondary" variant="body2">
                        {stat.label}
                      </Typography>
                      <Typography variant="h4" fontWeight={700}>
                        {stat.value}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: `${stat.color}.light`, color: `${stat.color}.dark` }}>
                      <stat.icon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} mb={4}>
          {quickActions.map((action) => (
            <Grid key={action.to} size={{ xs: 12, md: 6 }}>
              <Card>
                <CardActionArea component={RouterLink} to={action.to} sx={{ height: '100%' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>
                        <action.icon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {action.title}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          {action.description}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Recent Tasks
            </Typography>
            {recentTasks.length > 0 ? (
              <Box display="flex" flexDirection="column" gap={1.5}>
                {recentTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={deleteTask}
                    onToggleStatus={toggleTaskStatus}
                  />
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">
                No tasks yet. Create your first task!
              </Typography>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
