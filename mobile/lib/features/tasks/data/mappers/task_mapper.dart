import '../../domain/entities/patch.dart';
import '../../domain/entities/task.dart';
import '../../domain/entities/task_params.dart';
import '../../domain/entities/task_priority.dart';
import '../../domain/entities/task_status.dart';
import '../dtos/task_dto.dart';

/// The server's spelling of each status.
extension TaskStatusWire on TaskStatus {
  String get wire => switch (this) {
    TaskStatus.todo => 'TODO',
    TaskStatus.inProgress => 'IN_PROGRESS',
    TaskStatus.completed => 'COMPLETED',
  };
}

/// The server's spelling of each priority.
extension TaskPriorityWire on TaskPriority {
  String get wire => switch (this) {
    TaskPriority.low => 'LOW',
    TaskPriority.medium => 'MEDIUM',
    TaskPriority.high => 'HIGH',
  };
}

/// Reads a wire string back into one of [values]; unknown text is a
/// FormatException, which the repository turns into UnknownFailure.
T _fromWire<T extends Enum>(
  List<T> values,
  String Function(T) wire,
  String text,
) {
  for (final value in values) {
    if (wire(value) == text) return value;
  }
  throw FormatException('Unknown value: $text');
}

/// Due dates travel as `YYYY-MM-DD`, like the web app's date input.
String toWireDate(DateTime date) =>
    '${date.year.toString().padLeft(4, '0')}-'
    '${date.month.toString().padLeft(2, '0')}-'
    '${date.day.toString().padLeft(2, '0')}';

extension TaskDtoMapper on TaskDto {
  Task toDomain() => Task(
    id: id,
    title: title,
    description: description,
    status: _fromWire(TaskStatus.values, (s) => s.wire, status),
    priority: _fromWire(TaskPriority.values, (p) => p.wire, priority),
    dueDate: switch (dueDate) {
      final text? when text.isNotEmpty => DateTime.parse(text),
      _ => null,
    },
  );
}

Map<String, String> taskQuery(GetTasksParams params) => {
  'status': ?params.status?.wire,
  'priority': ?params.priority?.wire,
};

Map<String, Object?> createTaskBody(CreateTaskParams params) => {
  'title': params.title,
  'description': ?params.description,
  'priority': ?params.priority?.wire,
  if (params.dueDate case final dueDate?) 'dueDate': toWireDate(dueDate),
};

/// Only changed fields are sent. A [Patch] becomes: Keep → key left out,
/// Clear → `null`, SetTo → the value (shared rule §2, tri-state patches).
Map<String, Object?> updateTaskBody(UpdateTaskParams params) => {
  'title': ?params.title,
  ..._patchEntry('description', params.description, (text) => text),
  'status': ?params.status?.wire,
  'priority': ?params.priority?.wire,
  ..._patchEntry('dueDate', params.dueDate, toWireDate),
};

Map<String, Object?> _patchEntry<T>(
  String key,
  Patch<T> patch,
  Object? Function(T value) encode,
) => switch (patch) {
  Keep() => const {},
  Clear() => {key: null},
  SetTo(:final value) => {key: encode(value)},
};
