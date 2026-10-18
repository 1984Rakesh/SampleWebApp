import { useState } from 'react';
import { useTaskListViewModel, useTaskFormViewModel } from '../hooks';
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
  const {
    title,
    submitLabel,
    formData,
    priorityOptions,
    updateField,
    fieldErrors,
    submitError,
    canSubmit,
    submit,
    isSubmitting,
  } = useTaskFormViewModel(editingTask);

  const handleFormSubmit = async () => {
    if (await submit()) {
      onSaved();
    }
  };

  return (
    <TaskForm
      title={title}
      submitLabel={submitLabel}
      formData={formData}
      priorityOptions={priorityOptions}
      errors={fieldErrors}
      submitError={submitError}
      submitDisabled={!canSubmit}
      updateField={updateField}
      onSubmit={handleFormSubmit}
      onCancel={onCancel}
      isLoading={isSubmitting}
    />
  );
}

export default function TaskListScreen() {
  const {
    taskItems,
    isLoading,
    errorMessage,
    actionError,
    statusFilter,
    priorityFilter,
    setStatusFilter,
    setPriorityFilter,
    applyFilters,
    statusOptions,
    priorityOptions,
    taskById,
    deleteTask,
    toggleTaskStatus,
  } = useTaskListViewModel();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const handleCreate = () => {
    setEditingTask(undefined);
    setShowForm(true);
  };

  const handleEdit = (id: string) => {
    setEditingTask(taskById(id));
    setShowForm(true);
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditingTask(undefined);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTask(undefined);
  };

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <TaskListHeader onCreate={handleCreate} />
        <TaskFilters
          status={statusFilter}
          priority={priorityFilter}
          statusOptions={statusOptions}
          priorityOptions={priorityOptions}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
          onApply={applyFilters}
        />

        {actionError && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
            {actionError}
          </div>
        )}

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
          tasks={taskItems}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onEdit={handleEdit}
          onDelete={deleteTask}
          onToggleStatus={toggleTaskStatus}
        />
      </div>
    </main>
  );
}
