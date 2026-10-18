import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ReplayIcon from '@mui/icons-material/Replay';
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

interface TaskActionsProps {
  task: TaskItemViewState;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

function TaskActions({ task, onEdit, onDelete, onToggleStatus }: TaskActionsProps) {
  return (
    <Stack direction="row" spacing={0.5} role="group" aria-label={`Actions for ${task.title}`}>
      <Tooltip title={task.toggleLabel}>
        <IconButton
          size="small"
          color={task.isCompleted ? 'default' : 'success'}
          onClick={() => onToggleStatus(task.id)}
          aria-label={task.toggleAriaLabel}
          sx={{ '&:hover': { bgcolor: 'action.hover' } }}
        >
          {task.isCompleted ? <ReplayIcon fontSize="small" /> : <CheckCircleOutlineIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit">
        <IconButton
          size="small"
          color="info"
          onClick={() => onEdit(task.id)}
          aria-label={`Edit ${task.title}`}
          sx={{ '&:hover': { bgcolor: 'action.hover' } }}
        >
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton
          size="small"
          color="error"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete ${task.title}`}
          sx={{ '&:hover': { bgcolor: 'action.hover' } }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

const headerCellSx = {
  color: '#64748B',
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  borderColor: 'divider',
  whiteSpace: 'nowrap',
};

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
      <Box textAlign="center" py={6} color="text.secondary">
        No tasks found. Create your first task!
      </Box>
    );
  }

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          display: { xs: 'none', md: 'block' },
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: 'background.paper',
        }}
      >
        <Table aria-label="Tasks">
          <TableHead>
            <TableRow sx={{ bgcolor: 'rgba(148, 163, 184, 0.04)' }}>
              <TableCell sx={headerCellSx}>Title</TableCell>
              <TableCell sx={headerCellSx}>Status</TableCell>
              <TableCell sx={headerCellSx}>Priority</TableCell>
              <TableCell sx={headerCellSx}>Due Date</TableCell>
              <TableCell align="right" sx={headerCellSx}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleTasks.map((task) => (
              <TableRow key={task.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                <TableCell sx={{ borderColor: 'divider', fontWeight: 500 }}>{task.title}</TableCell>
                <TableCell sx={{ borderColor: 'divider' }}>
                  <UiChip label={task.statusLabel} tone={task.statusTone} />
                </TableCell>
                <TableCell sx={{ borderColor: 'divider' }}>
                  <UiChip label={task.priorityLabel} tone={task.priorityTone} />
                </TableCell>
                <TableCell sx={{ borderColor: 'divider', color: 'text.secondary', whiteSpace: 'nowrap' }}>
                  {task.dueDateLabel ?? '—'}
                </TableCell>
                <TableCell align="right" sx={{ borderColor: 'divider' }}>
                  <Box display="flex" justifyContent="flex-end">
                    <TaskActions
                      task={task}
                      onEdit={onEdit}
                      onDelete={setDeleteId}
                      onToggleStatus={onToggleStatus}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack spacing={1.5} sx={{ display: { xs: 'flex', md: 'none' } }}>
        {visibleTasks.map((task) => (
          <Card
            key={task.id}
            elevation={0}
            sx={{
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#161F30' : 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                <Typography variant="h6" component="h2" fontWeight={600} sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                  {task.title}
                </Typography>
                <TaskActions
                  task={task}
                  onEdit={onEdit}
                  onDelete={setDeleteId}
                  onToggleStatus={onToggleStatus}
                />
              </Box>
              <Typography variant="caption" color="text.secondary" display="block" mt={1.5}>
                Due date
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {task.dueDateLabel ?? 'No due date'}
              </Typography>
              <Stack direction="row" spacing={1} mt={2} flexWrap="wrap" useFlexGap>
                <UiChip label={task.statusLabel} tone={task.statusTone} />
                <UiChip label={task.priorityLabel} tone={task.priorityTone} />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <TablePagination
        component="div"
        count={tasks.length}
        page={visiblePage}
        onPageChange={(_event, nextPage) => setPage(nextPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(Number(event.target.value));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 25, 50]}
        labelRowsPerPage="Rows per page"
        sx={{
          mt: 1,
          overflow: 'hidden',
          color: 'text.secondary',
          '.MuiTablePagination-toolbar': { px: { xs: 0, sm: 2 }, minHeight: 52 },
          '.MuiTablePagination-selectLabel': { display: { xs: 'none', sm: 'block' } },
          '.MuiTablePagination-select': { display: { xs: 'none', sm: 'inline-flex' } },
          '.MuiTablePagination-spacer': { display: { xs: 'none', sm: 'block' } },
          '.MuiTablePagination-displayedRows': { ml: { xs: 'auto', sm: 0 } },
          '.MuiTablePagination-actions': { ml: { xs: 0.5, sm: 2.5 } },
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
            <UiButton onClick={handleConfirmDelete} color="error" variant="contained">
              Delete
            </UiButton>
          </>
        }
      />
    </>
  );
}
