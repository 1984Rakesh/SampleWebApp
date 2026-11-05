import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:tasks_mobile/core/failures/app_failure.dart';
import 'package:tasks_mobile/features/tasks/presentation/providers/task_use_case_providers.dart';
import 'package:tasks_mobile/features/tasks/presentation/view_models/task_list_view_model.dart';
import 'package:tasks_mobile/features/tasks/presentation/view_state/task_list_view_state.dart';

import '../tasks_fakes.dart';

void main() {
  late FakeGetTasksUseCase getTasks;
  late ProviderContainer container;

  setUp(() {
    getTasks = FakeGetTasksUseCase();
    container = ProviderContainer.test(
      overrides: [getTasksUseCaseProvider.overrideWithValue(getTasks)],
    );
  });

  TaskListViewModel viewModel() =>
      container.read(taskListViewModelProvider.notifier);

  // Keep the autoDispose provider alive and kick off the first load;
  // call after the fake is configured because listening starts the load.
  void start() {
    container.listen(taskListViewModelProvider, (_, _) {});
  }

  // Let the in-flight load finish before checking state.
  Future<void> flush() => Future<void>.delayed(Duration.zero);

  test('loads the tasks into Loaded', () async {
    getTasks.tasks = [sampleTask];
    start();
    await flush();

    final state = container.read(taskListViewModelProvider);
    expect(state, isA<TaskListLoaded>());
    expect((state as TaskListLoaded).items.single.title, 'Buy milk');
  });

  test('no tasks lands on Empty', () async {
    start();
    await flush();

    expect(container.read(taskListViewModelProvider), isA<TaskListEmpty>());
  });

  test('a failure lands on Error and retry recovers', () async {
    getTasks
      ..failWith = const NetworkFailure()
      ..tasks = [sampleTask];
    start();
    await flush();

    expect(
      container.read(taskListViewModelProvider),
      isA<TaskListError>().having(
        (e) => e.message,
        'message',
        'Cannot reach the server. Check your connection.',
      ),
    );

    getTasks.failWith = null;
    await viewModel().retry();

    expect(container.read(taskListViewModelProvider), isA<TaskListLoaded>());
  });

  test('refresh picks up a newly added task', () async {
    start();
    await flush();
    expect(container.read(taskListViewModelProvider), isA<TaskListEmpty>());

    getTasks.tasks = [sampleTask];
    await viewModel().refresh();

    final state = container.read(taskListViewModelProvider);
    expect(state, isA<TaskListLoaded>());
    expect((state as TaskListLoaded).items.single.id, 'task-1');
  });
}
