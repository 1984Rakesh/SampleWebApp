import { UiFlex, UiText } from './ui';

interface TaskListHeaderProps { total: number; todo: number }

export default function TaskListHeader({ total, todo }: TaskListHeaderProps) {
  return (
    <UiFlex column gap={1} mb={3}>
      <UiText variant="h4" as="h1" weight="bold">Tasks</UiText>
      <UiText tone="muted">{total} tasks in total, {todo} still to do.</UiText>
    </UiFlex>
  );
}
