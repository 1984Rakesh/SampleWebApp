import { UiFlex, UiText } from '../../../components/ui';

interface TaskListHeaderProps { total: number; todo: number }

export default function TaskListHeader({ total, todo }: TaskListHeaderProps) {
  return (
    <UiFlex column gap={1} mb={3}>
      <UiText variant="pageTitle">Tasks</UiText>
      <UiText tone="muted">{total} tasks in total, {todo} still to do.</UiText>
    </UiFlex>
  );
}
