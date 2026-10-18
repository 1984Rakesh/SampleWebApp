import { UiButton, UiFlex, UiText } from './ui';

interface TaskListHeaderProps {
  onCreate: () => void;
}

export default function TaskListHeader({ onCreate }: TaskListHeaderProps) {
  return (
    <UiFlex justify="space-between" align="center" gap={2} mb={3}>
      <UiText variant="h4" as="h1" weight="semibold">
        Tasks
      </UiText>
      <UiButton variant="solid" onClick={onCreate} noShrink>
        Create Task
      </UiButton>
    </UiFlex>
  );
}
