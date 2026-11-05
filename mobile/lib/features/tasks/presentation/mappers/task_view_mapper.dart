import '../../domain/entities/task.dart';
import '../../domain/entities/task_priority.dart';
import '../../domain/entities/task_status.dart';
import '../view_state/task_item_view_state.dart';

/// English 3-letter month names; avoids pulling in intl just for this.
const _months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/// Turns a domain [Task] into the labels and tones the widgets render.
/// [now] is injected so tests can pin "today" instead of reading the clock.
TaskItemViewState toTaskItemViewState(Task task, DateTime now) {
  return TaskItemViewState(
    id: task.id,
    title: task.title,
    description: task.description,
    statusLabel: switch (task.status) {
      TaskStatus.todo => 'To do',
      TaskStatus.inProgress => 'In progress',
      TaskStatus.completed => 'Done',
    },
    statusTone: switch (task.status) {
      TaskStatus.todo => StatusTone.todo,
      TaskStatus.inProgress => StatusTone.inProgress,
      TaskStatus.completed => StatusTone.completed,
    },
    priorityLabel: switch (task.priority) {
      TaskPriority.low => 'Low',
      TaskPriority.medium => 'Medium',
      TaskPriority.high => 'High',
    },
    priorityTone: switch (task.priority) {
      TaskPriority.low => PriorityTone.low,
      TaskPriority.medium => PriorityTone.medium,
      TaskPriority.high => PriorityTone.high,
    },
    dueLabel: switch (task.dueDate) {
      null => null,
      final due => 'Due ${_months[due.month - 1]} ${due.day}',
    },
    isOverdue: task.isOverdue(now),
    isCompleted: task.isCompleted,
  );
}
