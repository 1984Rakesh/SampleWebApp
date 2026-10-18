import { Link } from 'react-router-dom';
import { useAuthViewModel } from '../hooks';
import { useTaskListViewModel } from '../hooks';
import { useUserViewModel } from '../hooks';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DashboardScreen() {
  const { user } = useAuthViewModel();
  const { profile, isLoading: userLoading } = useUserViewModel();
  const { taskItems, counts, isLoading: tasksLoading, deleteTask, toggleTaskStatus } = useTaskListViewModel();

  const recentTasks = taskItems.slice(0, 3);

  if (userLoading || tasksLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name || profile?.name || 'User'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's an overview of your tasks and progress.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{counts.completed}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{counts.inProgress}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">To Do</p>
                <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">{counts.todo}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
                <svg className="w-8 h-8 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/tasks"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Manage Tasks</h3>
            <p className="text-gray-600 dark:text-gray-400">Create, edit, and organize your tasks</p>
          </Link>

          <Link
            to="/profile"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">View Profile</h3>
            <p className="text-gray-600 dark:text-gray-400">Update your profile information</p>
          </Link>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Tasks</h2>
          {recentTasks.length > 0 ? (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={deleteTask}
                  onToggleStatus={toggleTaskStatus}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No tasks yet. Create your first task!</p>
          )}
        </div>
      </div>
    </div>
  );
}
