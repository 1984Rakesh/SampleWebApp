import { useTaskListViewModel, useTaskFormViewModel } from '../hooks';
import type { TaskFormData } from '../models/TaskFormViewState';
import {
  TaskFilters,
  TaskForm,
  TaskListContent,
  TaskListHeader,
} from '../components';
import { UiAlert, UiFlex, UiScreen } from '../components/ui';

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
    <UiScreen maxWidth="xl">
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
        <UiAlert type="error" gutterBottom>
          {actionError}
        </UiAlert>
      )}

      {showForm && (
        <UiFlex mb={3}>
          <UiFlex grow>
            <TaskFormSection
              key={editingTaskId ?? 'new'}
              editingTaskId={editingTaskId}
              initialData={editingFormData}
              onSaved={closeForm}
              onCancel={closeForm}
            />
          </UiFlex>
        </UiFlex>
      )}

      <TaskListContent
        tasks={taskItems}
        isLoading={isLoading}
        errorMessage={errorMessage}
        onEdit={openEditForm}
        onDelete={deleteTask}
        onToggleStatus={toggleTaskStatus}
      />
    </UiScreen>
  );
}
