import { useState } from 'react';
import { useTaskListViewModel } from '../hooks';
import { TaskStatus, TaskPriority } from '../../domain/models';
import type { Task } from '../../domain/models';
import {
  TaskFilters,
  TaskForm,
  TaskListContent,
  TaskListHeader,
  type TaskFormData,
} from '../components';

export default function TaskListScreen() {
  const { tasks, isLoading, error, getTasks, createTask, updateTask, deleteTask, toggleTaskStatus } = useTaskListViewModel();
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

  const handleSubmit = async (formData: TaskFormData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData);
      } else {
        await createTask(formData);
      }
      setShowForm(false);
      setEditingTask(undefined);
      getTasks();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
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
            <TaskForm
              task={editingTask}
              onSubmit={handleSubmit}
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
