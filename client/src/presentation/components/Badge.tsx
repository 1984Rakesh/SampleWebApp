import type { BadgeTone } from '../models/TaskListViewState';

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
}

export default function Badge({ label, tone = 'neutral' }: BadgeProps) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${TONE_CLASSES[tone]}`}>
      {label}
    </span>
  );
}
