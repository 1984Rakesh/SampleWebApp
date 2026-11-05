import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/failures/app_failure.dart';
import '../../domain/entities/task_params.dart';
import '../mappers/task_view_mapper.dart';
import '../providers/task_use_case_providers.dart';
import '../view_state/task_list_view_state.dart';

/// Loads the signed-in user's tasks and turns them into list rows.
class TaskListViewModel extends Notifier<TaskListViewState> {
  @override
  TaskListViewState build() {
    // Kick off the first load; the async gap below owns state updates.
    _load();
    return const TaskListLoading();
  }

  Future<void> _load() async {
    try {
      final tasks = await ref.read(getTasksUseCaseProvider)(
        const GetTasksParams(),
      );
      if (!ref.mounted) return;
      final items = tasks
          .map((task) => toTaskItemViewState(task, DateTime.now()))
          .toList();
      state = items.isEmpty ? const TaskListEmpty() : TaskListLoaded(items);
    } on AppFailure catch (e) {
      if (!ref.mounted) return;
      state = TaskListError(e.message);
    }
  }

  /// Pull-to-refresh: keeps the current state until the reload lands.
  Future<void> refresh() => _load();

  /// Retry after an error: show the spinner, then reload.
  Future<void> retry() async {
    state = const TaskListLoading();
    await _load();
  }
}

/// autoDispose so leaving the screen drops the cached list.
final taskListViewModelProvider =
    NotifierProvider.autoDispose<TaskListViewModel, TaskListViewState>(
      TaskListViewModel.new,
    );
