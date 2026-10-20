import type { SelectOption } from '../../../components/ui/SelectOption';

export interface TaskFormData {
  title: string;
  description: string;
  priority: string;
  dueDate: string;
}

export type TaskFormFieldErrors = Partial<Record<keyof TaskFormData, string>>;

export interface TaskFormViewState {
  title: string;
  submitLabel: string;
  formData: TaskFormData;
  priorityOptions: SelectOption[];
  fieldErrors: TaskFormFieldErrors;
  submitError?: string;
  canSubmit: boolean;
  isSubmitting: boolean;
}
