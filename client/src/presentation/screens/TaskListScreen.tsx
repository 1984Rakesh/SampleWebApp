import { useState } from 'react';
import { useTaskListViewModel } from '../hooks';
import { TaskStatus, TaskPriority } from '../../domain/models';
import type { Task } from '../../domain/models';
import TaskCard from '../components/TaskCard';
import TaskForm, { type TaskFormData } from '../components/TaskForm';
import LoadingSpinner from '../components/LoadingSpinner';

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Create Task
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TaskStatus)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All</option>
                <option value={TaskStatus.TODO}>To Do</option>
                <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                <option value={TaskStatus.COMPLETED}>Completed</option>
              </select>
            </div>

            <div>
              <label htmlFor="priorityFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                id="priorityFilter"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as TaskPriority)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All</option>
                <option value={TaskPriority.LOW}>Low</option>
                <option value={TaskPriority.MEDIUM}>Medium</option>
                <option value={TaskPriority.HIGH}>High</option>
              </select>
            </div>

            <button
              onClick={handleFilter}
              className="ml-auto bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium transition-colors self-end"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Task Form */}
        {showForm && (
          <div className="mb-6">
            <TaskForm
              task={editingTask}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Tasks List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" text="Loading tasks..." />
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded">
            Error loading tasks: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={deleteTask}
                onToggleStatus={toggleTaskStatus}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            No tasks found. Create your first task!
          </div>
        )}
      </div>
    </div>
  );
}
