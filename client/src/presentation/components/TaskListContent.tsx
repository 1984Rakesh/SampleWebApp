import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { UiAlert, UiFlex, UiResponsive, UiTablePagination, UiText } from './ui';
import TaskTable from './taskList/TaskTable';
import TaskMobileCardList from './taskList/TaskMobileCardList';
import DeleteTaskDialog from './taskList/DeleteTaskDialog';
import type { TaskItemViewState } from '../models/TaskListViewState';

interface TaskListContentProps {
  tasks: TaskItemViewState[];
  isLoading: boolean;
  errorMessage?: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export default function TaskListContent({
  tasks,
  isLoading,
  errorMessage,
  onEdit,
  onDelete,
  onToggleStatus,
}: TaskListContentProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const lastPage = Math.max(0, Math.ceil(tasks.length / rowsPerPage) - 1);
  const visiblePage = Math.min(page, lastPage);
  const visibleTasks = tasks.slice(visiblePage * rowsPerPage, visiblePage * rowsPerPage + rowsPerPage);

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <UiFlex align="center" justify="center" py={6}>
        <LoadingSpinner size="lg" text="Loading tasks..." />
      </UiFlex>
    );
  }

  if (errorMessage) {
    return (
      <UiAlert type="error" gutterBottom>
        Error loading tasks: {errorMessage}
      </UiAlert>
    );
  }

  if (tasks.length === 0) {
    return (
      <UiFlex justify="center" py={6}>
        <UiText tone="muted">No tasks found. Create your first task!</UiText>
      </UiFlex>
    );
  }

  return (
    <>
      <UiResponsive hideBelow="md">
        <TaskTable
          tasks={visibleTasks}
          onEdit={onEdit}
          onDelete={setDeleteId}
          onToggleStatus={onToggleStatus}
        />
      </UiResponsive>

      <UiResponsive hideFrom="md" display="flex">
        <TaskMobileCardList
          tasks={visibleTasks}
          onEdit={onEdit}
          onDelete={setDeleteId}
          onToggleStatus={onToggleStatus}
        />
      </UiResponsive>

      <UiTablePagination
        count={tasks.length}
        page={visiblePage}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(next) => {
          setRowsPerPage(next);
          setPage(0);
        }}
      />

      <DeleteTaskDialog
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
