import { useState } from 'react';
import { useTaskListViewModel, useTaskFormViewModel } from '../hooks';
import { TaskStatus, TaskPriority } from '../../domain/models';
import type { Task } from '../../domain/models';
import {
  TaskFilters,
  TaskForm,
  TaskListContent,
  TaskListHeader,
} from '../components';

interface TaskFormSectionProps {
  editingTask?: Task;
  onSaved: () => void;
  onCancel: () => void;
}

function TaskFormSection({ editingTask, onSaved, onCancel }: TaskFormSectionProps) {
  const { formData, updateField, errors, handleSubmit, isSubmitting } = useTaskFormViewModel(editingTask);

  const handleFormSubmit = async () => {
    try {
      await handleSubmit();
      onSaved();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  return (
    <TaskForm
      task={editingTask}
      formData={formData}
      errors={errors}
      updateField={updateField}
      onSubmit={handleFormSubmit}
      onCancel={onCancel}
      isLoading={isSubmitting}
    />
  );
}

export default function TaskListScreen() {
  const { tasks, isLoading, error, getTasks, deleteTask, toggleTaskStatus } = useTaskListViewModel();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | ''>('');

  const handleFilter = () => {
    getTasks({
      status: statusFilter || undefined,
      priority: priorityFilter || undefined,
    });
  };

  const handleCreate = () => {
    setEditingTask(undefined);
    setShowForm(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditingTask(undefined);
    getTasks();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTask(undefined);
  };

  const filteredTasks = tasks?.filter((task) => {
    if (statusFilter && task.status !== statusFilter) return false;
    if (priorityFilter && task.priority !== priorityFilter) return false;
    return true;
  }) || [];

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <TaskListHeader onCreate={handleCreate} />
        <TaskFilters
          status={statusFilter}
          priority={priorityFilter}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
          onApply={handleFilter}
        />

        {showForm && (
          <div className="mb-6">
            <TaskFormSection
              key={editingTask?.id ?? 'new'}
              editingTask={editingTask}
              onSaved={handleSaved}
              onCancel={handleCancel}
            />
          </div>
        )}

        <TaskListContent
          tasks={filteredTasks}
          isLoading={isLoading}
          error={error}
          onEdit={handleEdit}
          onDelete={deleteTask}
          onToggleStatus={toggleTaskStatus}
        />
      </div>
    </main>
  );
}
