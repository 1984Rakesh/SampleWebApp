// Display labels for backend TaskStatus values. The API enum strings
// (TODO / IN_PROGRESS / COMPLETED) stay unchanged; only UI copy uses these.
export const TASK_STATUS_LABELS: Record<string, string> = {
  TODO: 'To do',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Done',
};
