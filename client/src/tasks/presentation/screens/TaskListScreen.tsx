import { OctagonX } from 'lucide-react';
import { useTaskListViewModel } from '../hooks';
import { TaskDialog, TaskFilters, TaskListContent, TaskListHeader } from '../components';
import { Alert, AlertDescription } from '../../../components/ui';

export default function TaskListScreen() {
  const tasks = useTaskListViewModel();
  return (
    <main className="min-h-screen bg-background px-4 py-4 md:px-8 md:pt-10 md:pb-16">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6">
        <TaskListHeader total={tasks.total} todo={tasks.counts.todo} />
        <div className="flex flex-col gap-3">
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
          {tasks.actionError && (
            <Alert variant="destructive">
              <OctagonX />
              <AlertDescription>{tasks.actionError}</AlertDescription>
            </Alert>
          )}
          <TaskListContent tasks={tasks.taskItems} total={tasks.total} isLoading={tasks.isLoading} errorMessage={tasks.errorMessage} onEdit={tasks.openEditForm} onDelete={tasks.deleteTask} onToggleStatus={tasks.toggleTaskStatus} />
        </div>
      </div>
      {tasks.showForm && tasks.editingTaskId && <TaskDialog key={tasks.editingTaskId} open editingTaskId={tasks.editingTaskId} initialData={tasks.editingFormData} onClose={tasks.closeForm} />}
    </main>
  );
}
