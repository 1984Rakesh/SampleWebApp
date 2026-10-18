import type { FormEvent, ReactNode } from 'react';
import type { SelectOption, TaskFormData } from '../models/TaskFormViewState';

interface TaskFormProps {
  title: string;
  submitLabel: string;
  formData: TaskFormData;
  priorityOptions: SelectOption[];
  errors: Record<string, string>;
  onSubmit: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  updateField: (field: keyof TaskFormData, value: string) => void;
}

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

interface FormActionsProps {
  submitLabel: string;
  submitDisabled: boolean;
  isLoading: boolean;
  onCancel?: () => void;
}

const inputClassName =
  'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white';

function FormField({ label, htmlFor, error, required = false, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}{required && ' *'}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

function FormActions({ submitLabel, submitDisabled, isLoading, onCancel }: FormActionsProps) {
  return (
    <div className="flex gap-2 mt-6">
      <button
        type="submit"
        disabled={isLoading || submitDisabled}
        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
      >
        {isLoading ? 'Saving...' : submitLabel}
      </button>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Cancel
        </button>
      )}
    </div>
  );
}

export default function TaskForm({
  title,
  submitLabel,
  formData,
  priorityOptions,
  errors,
  onSubmit,
  onCancel,
  isLoading = false,
  updateField,
}: TaskFormProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>

      <div className="space-y-4">
        <FormField label="Title" htmlFor="title" error={errors.title} required>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(event) => updateField('title', event.target.value)}
            className={inputClassName}
            disabled={isLoading}
          />
        </FormField>

        <FormField label="Description" htmlFor="description">
          <textarea
            id="description"
            value={formData.description}
            onChange={(event) => updateField('description', event.target.value)}
            rows={3}
            className={inputClassName}
            disabled={isLoading}
          />
        </FormField>

        <FormField label="Priority" htmlFor="priority" error={errors.priority}>
          <select
            id="priority"
            value={formData.priority}
            onChange={(event) => updateField('priority', event.target.value)}
            className={inputClassName}
            disabled={isLoading}
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Due Date" htmlFor="dueDate">
          <input
            type="date"
            id="dueDate"
            value={formData.dueDate}
            onChange={(event) => updateField('dueDate', event.target.value)}
            className={inputClassName}
            disabled={isLoading}
          />
        </FormField>
      </div>

      <FormActions
        submitLabel={submitLabel}
        submitDisabled={!formData.title.trim()}
        isLoading={isLoading}
        onCancel={onCancel}
      />
    </form>
  );
}
