import { axiosClient, configureAuthentication, createHttpClient } from '../../foundation/network';
import { browserStorage } from '../../foundation/session';
import { createComparisonFeature } from '../../comparison';
import { createDashboardFeature, DashboardRoute } from '../../dashboard';
import { createProfileFeature, ProfileRoute } from '../../profile';
import { createSecurityFeature } from '../../security';
import { createTasksFeature, TasksRoute } from '../../tasks';
import { useDashboardCapabilities, useProfileTaskCounts, useSessionListener } from './crossFeatureAdapters';
import { toProfileSession } from './profileSession';

// App supplies only cross-feature dependencies; each assembly builds its own feature (shared §10).
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
axiosClient.defaults.baseURL = baseURL;
const refreshClient = createHttpClient({ baseURL }).client;

function useAppSessionListener() {
  return useSessionListener(profile);
}
function useCurrentUserId() {
  return security.useSession().user?.id;
}
function useTaskCounts() {
  return useProfileTaskCounts(tasks);
}
function useAppDashboardCapabilities() {
  return useDashboardCapabilities(security, tasks, profile);
}

export const security = createSecurityFeature({
  http: axiosClient,
  refreshHttp: refreshClient,
  storage: browserStorage,
  useSessionListener: useAppSessionListener,
  routing: { homePath: DashboardRoute.home },
});
configureAuthentication(security.authentication);

export const tasks = createTasksFeature({ http: axiosClient });

export const profile = createProfileFeature({
  http: axiosClient,
  session: toProfileSession(security.sessions),
  useCurrentUserId,
  useTaskCounts,
  statusLabels: { completed: tasks.statusLabels.completed },
});

export const dashboard = createDashboardFeature({
  useCapabilities: useAppDashboardCapabilities,
  routing: { tasksPath: TasksRoute.list, profilePath: ProfileRoute.profile },
});

export const comparison = createComparisonFeature();
