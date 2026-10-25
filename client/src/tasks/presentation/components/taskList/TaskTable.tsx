// @ds TaskTable v2026-10-20
import { UiCheckbox, UiChip, UiFlex, UiTable, UiTableBody, UiTableCell, UiTableContainer, UiTableFooter, UiTableHead, UiTableRow, UiText } from '../../../../components/ui';
import TaskItemActions from './TaskItemActions';
import type { TaskItemViewState } from '../../models';

interface TaskTableProps { tasks: TaskItemViewState[]; footer?: React.ReactNode; onEdit: (id: string) => void; onDelete: (id: string) => void; onToggleStatus: (id: string) => void }

export default function TaskTable({ tasks, footer, onEdit, onDelete, onToggleStatus }: TaskTableProps) {
  return (
    <UiTableContainer>
      <UiTable ariaLabel="Tasks" fixed>
        <UiTableHead><UiTableRow head><UiTableCell head width="checkbox" edge="start" hideLabel>Done</UiTableCell><UiTableCell head>Task</UiTableCell><UiTableCell head width="meta">Status</UiTableCell><UiTableCell head width="meta">Priority</UiTableCell><UiTableCell head width="meta">Due</UiTableCell><UiTableCell head width="actions" edge="end" align="right">Actions</UiTableCell></UiTableRow></UiTableHead>
        <UiTableBody>{tasks.map((task) => (
          <UiTableRow key={task.id}>
            <UiTableCell edge="start"><UiCheckbox checked={task.isCompleted} ariaLabel={task.toggleAriaLabel} onChange={() => onToggleStatus(task.id)} /></UiTableCell>
            <UiTableCell roomy><UiFlex column minWidth0><UiText weight="medium" strike={task.isCompleted} tone={task.isCompleted ? 'muted' : 'default'} noWrap>{task.title}</UiText>{task.description && <UiText variant="body2" tone="muted" noWrap>{task.description}</UiText>}</UiFlex></UiTableCell>
            <UiTableCell><UiChip label={task.statusLabel} tone={task.statusTone} /></UiTableCell>
            <UiTableCell><UiChip label={`• ${task.priorityLabel}`} tone={task.priorityTone} /></UiTableCell>
            <UiTableCell nowrap><UiText variant="body2" tone={task.dueDateTone === 'amber' ? 'amber' : 'muted'} weight={task.dueDateTone === 'amber' ? 'medium' : undefined}>{task.dueDateLabel ?? '—'}</UiText></UiTableCell>
            <UiTableCell align="right" edge="end"><TaskItemActions task={task} onEdit={onEdit} onDelete={onDelete} onToggleStatus={onToggleStatus} /></UiTableCell>
          </UiTableRow>
        ))}</UiTableBody>
      </UiTable>
      {footer && <UiTableFooter>{footer}</UiTableFooter>}
    </UiTableContainer>
  );
}
