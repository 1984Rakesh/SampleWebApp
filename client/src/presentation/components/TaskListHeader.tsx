import { UiButton, UiFlex, UiIcon, UiText } from './ui';

interface TaskListHeaderProps { total: number; todo: number; onCreate: () => void }

export default function TaskListHeader({ total, todo, onCreate }: TaskListHeaderProps) {
  return (
    <UiFlex justify="space-between" align="end" wrap gap={2} mb={3}>
      <UiFlex column gap={1}>
        <UiText variant="h4" as="h1" weight="bold">Tasks</UiText>
        <UiText tone="muted">{total} tasks in total, {todo} still to do.</UiText>
      </UiFlex>
      <UiButton variant="solid" onClick={onCreate} startIcon={<UiIcon name="add" />} noShrink>New task</UiButton>
    </UiFlex>
  );
}
