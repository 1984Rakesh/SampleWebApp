import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import {
  UiAlert,
  UiButton,
  UiCard,
  UiCardContent,
  UiChip,
  UiDialog,
  UiFlex,
  UiIconButton,
  UiResponsive,
  UiStack,
  UiTable,
  UiTableBody,
  UiTableCell,
  UiTableContainer,
  UiTableHead,
  UiTablePagination,
  UiTableRow,
  UiText,
} from './ui';
import type { UiIconName } from './ui';
import type { TaskItemViewState } from '../models/TaskListViewState';

interface TaskListContentProps {
  tasks: TaskItemViewState[];
  isLoading: boolean;
  errorMessage?: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

interface TaskActionsProps {
  task: TaskItemViewState;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

function TaskActions({ task, onEdit, onDelete, onToggleStatus }: TaskActionsProps) {
  const toggleIcon: UiIconName = task.isCompleted ? 'undo' : 'check';

  return (
    <UiFlex gap={0.5} role="group" ariaLabel={`Actions for ${task.title}`}>
      <UiIconButton
        icon={toggleIcon}
        ariaLabel={task.toggleAriaLabel}
        tone={task.isCompleted ? 'default' : 'success'}
        size="sm"
        tooltip={task.toggleLabel}
        onClick={() => onToggleStatus(task.id)}
      />
      <UiIconButton
        icon="edit"
        ariaLabel={`Edit ${task.title}`}
        tone="info"
        size="sm"
        tooltip="Edit"
        onClick={() => onEdit(task.id)}
      />
      <UiIconButton
        icon="delete"
        ariaLabel={`Delete ${task.title}`}
        tone="danger"
        size="sm"
        tooltip="Delete"
        onClick={() => onDelete(task.id)}
      />
    </UiFlex>
  );
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
        <UiTableContainer>
          <UiTable ariaLabel="Tasks">
            <UiTableHead>
              <UiTableRow head>
                <UiTableCell head>Title</UiTableCell>
                <UiTableCell head>Status</UiTableCell>
                <UiTableCell head>Priority</UiTableCell>
                <UiTableCell head>Due Date</UiTableCell>
                <UiTableCell head align="right">Actions</UiTableCell>
              </UiTableRow>
            </UiTableHead>
            <UiTableBody>
              {visibleTasks.map((task) => (
                <UiTableRow key={task.id}>
                  <UiTableCell strong>{task.title}</UiTableCell>
                  <UiTableCell>
                    <UiChip label={task.statusLabel} tone={task.statusTone} />
                  </UiTableCell>
                  <UiTableCell>
                    <UiChip label={task.priorityLabel} tone={task.priorityTone} />
                  </UiTableCell>
                  <UiTableCell muted nowrap>
                    {task.dueDateLabel ?? '—'}
                  </UiTableCell>
                  <UiTableCell align="right">
                    <UiFlex justify="end">
                      <TaskActions
                        task={task}
                        onEdit={onEdit}
                        onDelete={setDeleteId}
                        onToggleStatus={onToggleStatus}
                      />
                    </UiFlex>
                  </UiTableCell>
                </UiTableRow>
              ))}
            </UiTableBody>
          </UiTable>
        </UiTableContainer>
      </UiResponsive>

      <UiResponsive hideFrom="md" display="flex">
        <UiStack spacing={1.5}>
          {visibleTasks.map((task) => (
            <UiCard key={task.id}>
              <UiCardContent compact>
                <UiFlex align="start" justify="space-between" gap={1}>
                  <UiText variant="h6" as="h2" weight="semibold" breakWord>
                    {task.title}
                  </UiText>
                  <TaskActions
                    task={task}
                    onEdit={onEdit}
                    onDelete={setDeleteId}
                    onToggleStatus={onToggleStatus}
                  />
                </UiFlex>
                <UiText variant="caption" tone="muted" mt={1.5}>
                  Due date
                </UiText>
                <UiText variant="body2" tone="muted">
                  {task.dueDateLabel ?? 'No due date'}
                </UiText>
                <UiStack direction="row" spacing={1} wrap mt={2}>
                  <UiChip label={task.statusLabel} tone={task.statusTone} />
                  <UiChip label={task.priorityLabel} tone={task.priorityTone} />
                </UiStack>
              </UiCardContent>
            </UiCard>
          ))}
        </UiStack>
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

      <UiDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        actions={
          <>
            <UiButton onClick={() => setDeleteId(null)}>Cancel</UiButton>
            <UiButton onClick={handleConfirmDelete} tone="danger" variant="solid">
              Delete
            </UiButton>
          </>
        }
      />
    </>
  );
}
