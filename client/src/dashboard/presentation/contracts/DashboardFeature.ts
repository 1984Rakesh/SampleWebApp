import type { ComponentType, ReactNode } from 'react';
import type { RouteObject } from 'react-router-dom';

/** What the dashboard assembly hands to App (shared §10). */
export interface DashboardFeature {
  routes: RouteObject[];
  Provider: ComponentType<{ children: ReactNode }>;
}
