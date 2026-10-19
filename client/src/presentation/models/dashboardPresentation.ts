import type { DashboardViewState } from './DashboardViewState';
import type { TaskCountsViewState, TaskItemViewState } from './TaskListViewState';

const dayKey = (value: Date) => `${value.getFullYear()}-${value.getMonth()}-${value.getDate()}`;

export function toDashboardViewState(name: string, tasks: TaskItemViewState[], counts: TaskCountsViewState, now = new Date()): DashboardViewState {
  const firstName = name.trim().split(/\s+/)[0] || 'there';
  const hour = now.getHours();
  const salutation = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const today = dayKey(now);
  const weekEnd = new Date(now);
  weekEnd.setDate(now.getDate() + 7);
  const dueToday = tasks.filter((task) => task.dueDate && dayKey(new Date(task.dueDate)) === today && !task.isCompleted).length;
  const dueThisWeek = tasks.filter((task) => {
    if (!task.dueDate || task.isCompleted) return false;
    const due = new Date(task.dueDate);
    return due >= now && due <= weekEnd;
  }).length;
  const total = tasks.length;
  return {
    eyebrow: now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase(),
    greeting: `${salutation}, ${firstName}`,
    summary: `${dueToday} ${dueToday === 1 ? 'task is' : 'tasks are'} due today and ${counts.todo} ${counts.todo === 1 ? 'is' : 'are'} still to do.`,
    counts,
    total,
    completionPercent: total ? Math.round((counts.completed / total) * 100) : 0,
    dueToday,
    dueThisWeek,
    recentTasks: [...tasks].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? '')).slice(0, 4),
  };
}
