import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useTaskListViewModel, useTaskFormViewModel } from '../hooks';
import type { TaskFormData } from '../models/TaskFormViewState';
import {
  TaskFilters,
  TaskForm,
  TaskListContent,
  TaskListHeader,
} from '../components';
import { UiAlert } from '../components/ui';

interface TaskFormSectionProps {
  editingTaskId?: string;
  initialData?: TaskFormData;
  onSaved: () => void;
  onCancel: () => void;
}

function TaskFormSection({ editingTaskId, initialData, onSaved, onCancel }: TaskFormSectionProps) {
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
  } = useTaskFormViewModel(editingTaskId, initialData);

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
    showForm,
    editingTaskId,
    editingFormData,
    openCreateForm,
    openEditForm,
    closeForm,
    deleteTask,
    toggleTaskStatus,
  } = useTaskListViewModel();

  return (
    <Box minHeight="100vh" bgcolor="background.default" px={{ xs: 1.5, sm: 2, md: 4 }} py={{ xs: 2, md: 4 }} overflow="hidden">
      <Container maxWidth="xl" disableGutters>
        <TaskListHeader onCreate={openCreateForm} />
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
              key={editingTaskId ?? 'new'}
              editingTaskId={editingTaskId}
              initialData={editingFormData}
              onSaved={closeForm}
              onCancel={closeForm}
            />
          </Box>
        )}

        <TaskListContent
          tasks={taskItems}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onEdit={openEditForm}
          onDelete={deleteTask}
          onToggleStatus={toggleTaskStatus}
        />
      </Container>
    </Box>
  );
}
