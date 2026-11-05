import 'package:flutter_test/flutter_test.dart';
import 'package:tasks_mobile/features/tasks/domain/entities/task.dart';
import 'package:tasks_mobile/features/tasks/domain/entities/task_priority.dart';
import 'package:tasks_mobile/features/tasks/domain/entities/task_status.dart';

void main() {
  // A fixed "now" keeps the overdue checks deterministic.
  final now = DateTime.utc(2026, 11, 5, 12);

  Task task({TaskStatus status = TaskStatus.todo, DateTime? dueDate}) => Task(
    id: 'task-1',
    title: 'Write tests',
    status: status,
    priority: TaskPriority.medium,
    dueDate: dueDate,
  );

  test('next cycles todo → inProgress → completed → todo', () {
    expect(TaskStatus.todo.next, TaskStatus.inProgress);
    expect(TaskStatus.inProgress.next, TaskStatus.completed);
    expect(TaskStatus.completed.next, TaskStatus.todo);
  });

  test('a task past its due date is overdue', () {
    expect(
      task(dueDate: now.subtract(const Duration(hours: 1))).isOverdue(now),
      isTrue,
    );
    expect(
      task(dueDate: now.add(const Duration(hours: 1))).isOverdue(now),
      isFalse,
    );
  });

  test('completed tasks and tasks without a due date are never overdue', () {
    expect(
      task(
        status: TaskStatus.completed,
        dueDate: now.subtract(const Duration(days: 1)),
      ).isOverdue(now),
      isFalse,
    );
    expect(task().isOverdue(now), isFalse);
  });

  test('two tasks with the same values are equal', () {
    final a = task(dueDate: now);
    final b = task(dueDate: now);

    expect(a, b);
    expect(a.hashCode, b.hashCode);
    expect(task(status: TaskStatus.completed), isNot(a));
  });
}
