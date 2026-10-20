export type { TaskFormData, TaskFormFieldErrors, TaskFormViewState } from './TaskFormViewState';
export type { BadgeTone, TaskItemViewState, TaskCountsViewState } from './TaskListViewState';
export { comparisonData } from './comparisonData';
export type { ComparisonLayer, ComparisonConcept } from './comparisonData';
export {
  formatEnumLabel,
  toTaskStatus,
  toTaskPriority,
  buildStatusOptions,
  buildPriorityOptions,
  withAllOption,
  toTaskItemViewState,
  toTaskCounts,
} from './taskPresentation';
