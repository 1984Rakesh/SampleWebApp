import 'task_item_view_state.dart';

/// Everything the tasks screen can be showing; `sealed` so a `switch`
/// over it must handle every case.
sealed class TaskListViewState {
  const TaskListViewState();
}

final class TaskListLoading extends TaskListViewState {
  const TaskListLoading();
}

final class TaskListLoaded extends TaskListViewState {
  const TaskListLoaded(this.items);

  final List<TaskItemViewState> items;
}

final class TaskListEmpty extends TaskListViewState {
  const TaskListEmpty();
}

final class TaskListError extends TaskListViewState {
  const TaskListError(this.message);

  /// Text that is safe to show the user.
  final String message;
}
