import { useTaskListViewModel } from '../hooks';
import { TaskFilters, TaskListContent, TaskListHeader } from '../components';
import TaskDialog from '../components/TaskDialog';
import { UiAlert, UiFlex, UiScreen } from '../../../components/ui';

export default function TaskListScreen() {
  const tasks = useTaskListViewModel();
  return (
    <UiScreen maxWidth="lg">
      <TaskListHeader total={tasks.total} todo={tasks.counts.todo} />
      <UiFlex column gap={3}>
        <TaskFilters
          search={tasks.searchQuery}
          status={tasks.statusFilter}
          priority={tasks.priorityFilter}
          counts={tasks.counts}
          total={tasks.total}
          statusOptions={tasks.statusOptions}
          priorityOptions={tasks.priorityOptions}
          onSearchChange={tasks.setSearchQuery}
          onStatusChange={tasks.setStatusFilter}
          onPriorityChange={tasks.setPriorityFilter}
        />
        {tasks.actionError && <UiAlert type="error">{tasks.actionError}</UiAlert>}
        <TaskListContent tasks={tasks.taskItems} total={tasks.total} isLoading={tasks.isLoading} errorMessage={tasks.errorMessage} onEdit={tasks.openEditForm} onDelete={tasks.deleteTask} onToggleStatus={tasks.toggleTaskStatus} />
      </UiFlex>
      {tasks.showForm && tasks.editingTaskId && <TaskDialog key={tasks.editingTaskId} open editingTaskId={tasks.editingTaskId} initialData={tasks.editingFormData} onClose={tasks.closeForm} />}
    </UiScreen>
  );
}
