import 'task_priority.dart';
import 'task_status.dart';

/// A single to-do item. Pure domain: no JSON, database or UI types here.
class Task {
  const Task({
    required this.id,
    required this.title,
    required this.status,
    required this.priority,
    this.description,
    this.dueDate,
  });

  final String id;
  final String title;
  final String? description;
  final TaskStatus status;
  final TaskPriority priority;
  final DateTime? dueDate;

  bool get isCompleted => status == TaskStatus.completed;

  /// `now` is injected so tests can pin "today" instead of reading the clock.
  bool isOverdue(DateTime now) =>
      !isCompleted && dueDate != null && dueDate!.isBefore(now);

  @override
  bool operator ==(Object other) =>
      other is Task &&
      other.id == id &&
      other.title == title &&
      other.description == description &&
      other.status == status &&
      other.priority == priority &&
      other.dueDate == dueDate;

  @override
  int get hashCode =>
      Object.hash(id, title, description, status, priority, dueDate);
}
