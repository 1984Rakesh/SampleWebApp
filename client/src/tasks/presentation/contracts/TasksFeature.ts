import type { ComponentType, ReactNode } from 'react';
import type { RouteObject } from 'react-router-dom';
import type { TaskOverview, TaskStatusLabels } from './TaskOverview';

export interface CreateTaskDialogProps {
  open: boolean;
  onClose(): void;
}

/** What the tasks assembly hands to App (shared §10). */
export interface TasksFeature {
  routes: RouteObject[];
  Provider: ComponentType<{ children: ReactNode }>;
  CreateTaskDialog: ComponentType<CreateTaskDialogProps>;
  statusLabels: TaskStatusLabels;
  useTaskOverview(): TaskOverview;
}
