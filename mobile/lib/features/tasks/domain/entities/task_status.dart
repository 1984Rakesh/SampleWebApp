/// Lifecycle of a task. The wire strings ('TODO', …) belong to the
/// data layer; domain code always uses this enum.
enum TaskStatus {
  todo,
  inProgress,
  completed;

  /// The status a toggle moves to: todo → inProgress → completed → todo.
  TaskStatus get next => switch (this) {
    TaskStatus.todo => TaskStatus.inProgress,
    TaskStatus.inProgress => TaskStatus.completed,
    TaskStatus.completed => TaskStatus.todo,
  };
}
