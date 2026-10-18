import { useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import LoadingSpinner from './LoadingSpinner';
import { UiChip, UiButton, UiAlert, UiDialog } from './ui';
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

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const columns: GridColDef<TaskItemViewState>[] = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 2,
      minWidth: 200,
    },
    {
      field: 'statusLabel',
      headerName: 'Status',
      flex: 1,
      minWidth: 120,
      renderCell: ({ row }) => <UiChip label={row.statusLabel} tone={row.statusTone} />,
    },
    {
      field: 'priorityLabel',
      headerName: 'Priority',
      flex: 1,
      minWidth: 120,
      renderCell: ({ row }) => <UiChip label={row.priorityLabel} tone={row.priorityTone} />,
    },
    {
      field: 'dueDateLabel',
      headerName: 'Due Date',
      flex: 1,
      minWidth: 120,
      valueGetter: (_value, row) => row.dueDateLabel ?? '-',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.5,
      minWidth: 280,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Box display="flex" gap={1} alignItems="center" height="100%">
          <UiButton
            variant="contained"
            size="small"
            onClick={() => onToggleStatus(row.id)}
            aria-label={row.toggleAriaLabel}
          >
            {row.toggleLabel}
          </UiButton>
          <UiButton
            variant="outlined"
            size="small"
            onClick={() => onEdit(row.id)}
          >
            Edit
          </UiButton>
          <UiButton
            variant="outlined"
            color="error"
            size="small"
            onClick={() => setDeleteId(row.id)}
          >
            Delete
          </UiButton>
        </Box>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" py={6}>
        <LoadingSpinner size="lg" text="Loading tasks..." />
      </Box>
    );
  }

  if (errorMessage) {
    return (
      <UiAlert severity="error" sx={{ mb: 2 }}>
        Error loading tasks: {errorMessage}
      </UiAlert>
    );
  }

  if (tasks.length === 0) {
    return (
      <Box textAlign="center" py={6}>
        No tasks found. Create your first task!
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={tasks}
          columns={columns}
          getRowId={(row) => row.id}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          disableRowSelectionOnClick
        />
      </Box>

      <UiDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        actions={
          <>
            <UiButton onClick={() => setDeleteId(null)}>Cancel</UiButton>
            <UiButton onClick={handleConfirmDelete} color="error" variant="contained">
              Delete
            </UiButton>
          </>
        }
      />
    </>
  );
}
