import 'patch.dart';
import 'task_priority.dart';
import 'task_status.dart';

/// Filter for listing tasks; a null field means "any".
final class GetTasksParams {
  const GetTasksParams({this.status, this.priority});

  final TaskStatus? status;
  final TaskPriority? priority;
}

/// Everything needed to create a task; the server assigns id and status.
final class CreateTaskParams {
  const CreateTaskParams({
    required this.title,
    this.description,
    this.priority,
    this.dueDate,
  });

  final String title;
  final String? description;
  final TaskPriority? priority;
  final DateTime? dueDate;
}

/// Partial update: null keeps scalar fields, [Patch] steers nullable ones.
final class UpdateTaskParams {
  const UpdateTaskParams({
    required this.id,
    this.title,
    this.description = const Keep(),
    this.status,
    this.priority,
    this.dueDate = const Keep(),
  });

  final String id;
  final String? title;
  final Patch<String> description;
  final TaskStatus? status;
  final TaskPriority? priority;
  final Patch<DateTime> dueDate;
}

/// The task to toggle plus its current status, so the use case can
/// compute the next one.
final class ToggleTaskStatusParams {
  const ToggleTaskStatusParams({required this.id, required this.current});

  final String id;
  final TaskStatus current;
}

/// Identity of the task to delete.
final class DeleteTaskParams {
  const DeleteTaskParams(this.id);

  final String id;
}
