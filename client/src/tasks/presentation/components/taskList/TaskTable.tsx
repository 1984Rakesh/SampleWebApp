import { UiCheckbox, UiChip, UiFlex, UiTable, UiTableBody, UiTableCell, UiTableContainer, UiTableHead, UiTableRow, UiText } from '../../../../components/ui';
import TaskItemActions from './TaskItemActions';
import type { TaskItemViewState } from '../../models/TaskListViewState';

interface TaskTableProps { tasks: TaskItemViewState[]; onEdit: (id: string) => void; onDelete: (id: string) => void; onToggleStatus: (id: string) => void }

export default function TaskTable({ tasks, onEdit, onDelete, onToggleStatus }: TaskTableProps) {
  return (
    <UiTableContainer>
      <UiTable ariaLabel="Tasks">
        <UiTableHead><UiTableRow head><UiTableCell head>Task</UiTableCell><UiTableCell head>Status</UiTableCell><UiTableCell head>Priority</UiTableCell><UiTableCell head>Due</UiTableCell><UiTableCell head align="right">Actions</UiTableCell></UiTableRow></UiTableHead>
        <UiTableBody>{tasks.map((task) => (
          <UiTableRow key={task.id}>
            <UiTableCell><UiFlex align="start" gap={1.5} minWidth0><UiCheckbox checked={task.isCompleted} ariaLabel={task.toggleAriaLabel} onChange={() => onToggleStatus(task.id)} /><UiFlex column minWidth0><UiText weight="semibold" strike={task.isCompleted} tone={task.isCompleted ? 'muted' : 'default'}>{task.title}</UiText>{task.description && <UiText variant="body2" tone="muted" noWrap maxWidth={360}>{task.description}</UiText>}</UiFlex></UiFlex></UiTableCell>
            <UiTableCell><UiChip label={task.statusLabel} tone={task.statusTone} /></UiTableCell>
            <UiTableCell><UiChip label={`• ${task.priorityLabel}`} tone={task.priorityTone} /></UiTableCell>
            <UiTableCell nowrap><UiText variant="body2" tone={task.dueDateTone === 'amber' ? 'amber' : 'muted'} weight={task.dueDateTone === 'amber' ? 'semibold' : undefined}>{task.dueDateLabel ?? '—'}</UiText></UiTableCell>
            <UiTableCell align="right"><UiFlex justify="end"><TaskItemActions task={task} onEdit={onEdit} onDelete={onDelete} onToggleStatus={onToggleStatus} /></UiFlex></UiTableCell>
          </UiTableRow>
        ))}</UiTableBody>
      </UiTable>
    </UiTableContainer>
  );
}
