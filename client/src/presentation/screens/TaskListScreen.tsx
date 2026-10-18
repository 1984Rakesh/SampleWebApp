import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useTaskListViewModel, useTaskFormViewModel } from '../hooks';
import type { Task } from '../../domain/models';
import {
  TaskFilters,
  TaskForm,
  TaskListContent,
  TaskListHeader,
} from '../components';
import { UiAlert } from '../components/ui';

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
    <Box minHeight="100vh" bgcolor="background.default" px={{ xs: 1.5, sm: 2, md: 4 }} py={{ xs: 2, md: 4 }} overflow="hidden">
      <Container maxWidth="xl" disableGutters>
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
          <UiAlert severity="error" sx={{ mb: 2 }}>
            {actionError}
          </UiAlert>
        )}

        {showForm && (
          <Box mb={3}>
            <TaskFormSection
              key={editingTask?.id ?? 'new'}
              editingTask={editingTask}
              onSaved={handleSaved}
              onCancel={handleCancel}
            />
          </Box>
        )}

        <TaskListContent
          tasks={taskItems}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onEdit={handleEdit}
          onDelete={deleteTask}
          onToggleStatus={toggleTaskStatus}
        />
      </Container>
    </Box>
  );
}
