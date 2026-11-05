import 'package:flutter_test/flutter_test.dart';
import 'package:tasks_mobile/features/tasks/domain/entities/task.dart';
import 'package:tasks_mobile/features/tasks/domain/entities/task_priority.dart';
import 'package:tasks_mobile/features/tasks/domain/entities/task_status.dart';
import 'package:tasks_mobile/features/tasks/presentation/mappers/task_view_mapper.dart';
import 'package:tasks_mobile/features/tasks/presentation/view_state/task_item_view_state.dart';

Task task({TaskStatus? status, TaskPriority? priority, DateTime? dueDate}) =>
    Task(
      id: 'task-1',
      title: 'Buy milk',
      status: status ?? TaskStatus.todo,
      priority: priority ?? TaskPriority.medium,
      dueDate: dueDate,
    );

void main() {
  final now = DateTime(2026, 11, 5, 12);

  test('maps every status and priority to its label and tone', () {
    final statuses = {
      TaskStatus.todo: ('To do', StatusTone.todo),
      TaskStatus.inProgress: ('In progress', StatusTone.inProgress),
      TaskStatus.completed: ('Done', StatusTone.completed),
    };
    for (final entry in statuses.entries) {
      final state = toTaskItemViewState(task(status: entry.key), now);
      expect(state.statusLabel, entry.value.$1);
      expect(state.statusTone, entry.value.$2);
    }

    final priorities = {
      TaskPriority.low: ('Low', PriorityTone.low),
      TaskPriority.medium: ('Medium', PriorityTone.medium),
      TaskPriority.high: ('High', PriorityTone.high),
    };
    for (final entry in priorities.entries) {
      final state = toTaskItemViewState(task(priority: entry.key), now);
      expect(state.priorityLabel, entry.value.$1);
      expect(state.priorityTone, entry.value.$2);
    }
  });

  test('a past due date gets a "Due MMM d" label and is overdue', () {
    final state = toTaskItemViewState(
      task(dueDate: DateTime(2026, 11, 4)),
      now,
    );

    expect(state.dueLabel, 'Due Nov 4');
    expect(state.isOverdue, isTrue);
  });

  test('a completed task is never overdue', () {
    final state = toTaskItemViewState(
      task(status: TaskStatus.completed, dueDate: DateTime(2026, 11, 4)),
      now,
    );

    expect(state.dueLabel, 'Due Nov 4');
    expect(state.isOverdue, isFalse);
    expect(state.isCompleted, isTrue);
  });

  test('no due date means no due label', () {
    final state = toTaskItemViewState(task(), now);

    expect(state.dueLabel, isNull);
    expect(state.isOverdue, isFalse);
  });
}
