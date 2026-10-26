import * as React from 'react';

export type IconName =
  | 'check' | 'check-circle' | 'clock' | 'list' | 'plus' | 'search' | 'sun' | 'moon'
  | 'logout' | 'calendar' | 'pencil' | 'trash' | 'chevron-down' | 'chevron-right'
  | 'user' | 'x' | 'arrow-right';

export interface IconProps { name: IconName; size?: number; strokeWidth?: number; className?: string; style?: React.CSSProperties; }

export interface ButtonProps {
  /** 'default' is the one main action per screen (bg-primary). */
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'ghost-destructive' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'icon' | 'icon-sm';
  icon?: IconName;
  /** With variant outline, use muted-foreground text (header icon buttons). */
  muted?: boolean;
  /** Renders an anchor instead of a button. */
  href?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
  /** Required for icon sizes. */
  'aria-label'?: string;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export interface BadgeProps {
  kind?: 'status' | 'priority';
  /** priority: High, Medium, Low. status: To do, In progress, Done. */
  value?: 'High' | 'Medium' | 'Low' | 'To do' | 'In progress' | 'Done';
  children?: React.ReactNode;
}

export interface CheckboxProps { checked?: boolean; onChange?: () => void; label?: string; }

export interface FieldProps {
  label?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  id?: string;
  type?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  readOnly?: boolean;
  /** Trailing icon, for example 'calendar' on a date field. */
  icon?: IconName;
  /** Leading icon, for example 'search' on a search box. */
  leadingIcon?: IconName;
  /** Hides the visible label; it becomes the aria-label (search boxes). */
  hideLabel?: boolean;
  /** 44px high instead of 48px. */
  compact?: boolean;
  /** Fill with the card colour instead of the input fill. */
  surface?: boolean;
  /** Shows the focus border without focus (for documentation). */
  focused?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export interface ToggleGroupProps {
  options: string[];
  value: string;
  label: string;
  /** 'priority' tints the selected option with its priority badge colors. */
  kind?: 'default' | 'priority';
  /** Stretch to the container width. */
  block?: boolean;
  /** 'sm' is 34px high (filters, theme picker). */
  size?: 'default' | 'sm';
  /** Count shown after each option label, keyed by option. */
  counts?: Record<string, number | string>;
  onChange?: (value: string) => void;
}

export interface StatCardProps {
  label: string;
  value: React.ReactNode;
  caption?: string;
  tone: 'done' | 'progress' | 'todo';
  /** Colors the caption text-warning, used for "due today". */
  alert?: boolean;
}

export interface TaskRowProps {
  title: string;
  description?: string;
  status: 'To do' | 'In progress' | 'Done';
  priority: 'High' | 'Medium' | 'Low';
  due?: string;
  dueToday?: boolean;
  done?: boolean;
  onToggle?: () => void;
}

export interface AppHeaderProps {
  active?: 'Dashboard' | 'Tasks' | 'Profile' | 'Comparison';
  /** Current theme; picks the sun or moon icon and its label. */
  mode?: 'dark' | 'light';
  user?: string;
  appName?: string;
  /** Link target per nav item (and the logo for Dashboard). */
  hrefs?: Partial<Record<'Dashboard' | 'Tasks' | 'Profile' | 'Comparison', string>>;
  /** Makes the theme button a link (mockup boards). */
  themeHref?: string;
  onToggleTheme?: () => void;
  onLogout?: () => void;
}

export interface DialogProps {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  /** Makes the close button a link. */
  closeHref?: string;
  /** Convenience footer: Cancel (outline) then the default action. Use instead of `actions` where only text props are possible. */
  cancelLabel?: string;
  submitLabel?: string;
  cancelHref?: string;
  submitHref?: string;
  onCancel?: () => void;
  onSubmit?: () => void;
  /** Footer buttons, right aligned: Cancel then the default action. */
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export interface SelectProps { label: string; options: string[]; value?: string; id?: string; onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void; }
export interface TaskTableRowProps {
  title: string; description?: string;
  status: 'To do' | 'In progress' | 'Done';
  priority: 'High' | 'Medium' | 'Low';
  due?: string; dueToday?: boolean; done?: boolean;
  onToggle?: () => void; onEdit?: () => void; onDelete?: () => void;
}

export const Icon: React.FC<IconProps>;
export const Button: React.FC<ButtonProps>;
export const Badge: React.FC<BadgeProps>;
export const Checkbox: React.FC<CheckboxProps>;
export const Field: React.FC<FieldProps>;
export const ToggleGroup: React.FC<ToggleGroupProps>;
export const StatCard: React.FC<StatCardProps>;
export const TaskRow: React.FC<TaskRowProps>;
export const AppHeader: React.FC<AppHeaderProps>;
export const Dialog: React.FC<DialogProps>;
export const Select: React.FC<SelectProps>;
export const TaskTableHead: React.FC<{}>;
export const TaskTableRow: React.FC<TaskTableRowProps>;
