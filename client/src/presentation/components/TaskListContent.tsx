import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { UiAlert, UiButton, UiCard, UiFlex, UiText } from './ui';
import TaskTable from './taskList/TaskTable';
import DeleteTaskDialog from './taskList/DeleteTaskDialog';
import type { TaskItemViewState } from '../models/TaskListViewState';

interface TaskListContentProps { tasks: TaskItemViewState[]; total: number; isLoading: boolean; errorMessage?: string; onEdit: (id: string) => void; onDelete: (id: string) => void; onToggleStatus: (id: string) => void }

export default function TaskListContent({ tasks, isLoading, errorMessage, onEdit, onDelete, onToggleStatus }: TaskListContentProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const rowsPerPage = 8;
  const lastPage = Math.max(0, Math.ceil(tasks.length / rowsPerPage) - 1);
  const visiblePage = Math.min(page, lastPage);
  const visibleTasks = tasks.slice(visiblePage * rowsPerPage, visiblePage * rowsPerPage + rowsPerPage);
  const confirmDelete = () => { if (deleteId) { onDelete(deleteId); setDeleteId(null); } };
  if (isLoading) return <UiFlex align="center" justify="center" py={6}><LoadingSpinner size="lg" text="Loading tasks..." /></UiFlex>;
  if (errorMessage) return <UiAlert type="error" gutterBottom>Error loading tasks: {errorMessage}</UiAlert>;
  if (tasks.length === 0) return <UiCard><UiFlex justify="center" py={6}><UiText tone="muted">No tasks match these filters.</UiText></UiFlex></UiCard>;
  const shown = visibleTasks.length;
  return (
    <>
      <UiCard><TaskTable tasks={visibleTasks} onEdit={onEdit} onDelete={setDeleteId} onToggleStatus={onToggleStatus} /><UiFlex justify="space-between" align="center" wrap gap={1} px={2.5} py={2}><UiText variant="body2" tone="muted">Showing {shown} of {tasks.length} tasks</UiText><UiFlex gap={1}><UiButton variant="outline" size="sm" disabled={visiblePage === 0} onClick={() => setPage((value) => value - 1)}>Previous</UiButton><UiButton variant="outline" size="sm" disabled={visiblePage >= lastPage} onClick={() => setPage((value) => value + 1)}>Next</UiButton></UiFlex></UiFlex></UiCard>
      <DeleteTaskDialog open={!!deleteId} onCancel={() => setDeleteId(null)} onConfirm={confirmDelete} />
    </>
  );
}
