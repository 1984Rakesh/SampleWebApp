import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/misc.dart' show Override;

import '../../features/tasks/data/datasources/task_remote_data_source.dart';
import '../../features/tasks/data/repositories/task_repository_impl.dart';
import '../../features/tasks/domain/repositories/task_repository.dart';
import '../../features/tasks/domain/use_cases/create_task_use_case.dart';
import '../../features/tasks/domain/use_cases/delete_task_use_case.dart';
import '../../features/tasks/domain/use_cases/get_tasks_use_case.dart';
import '../../features/tasks/domain/use_cases/toggle_task_status_use_case.dart';
import '../../features/tasks/domain/use_cases/update_task_use_case.dart';
import '../../features/tasks/presentation/providers/task_use_case_providers.dart';

/// Builds the tasks feature from the shared transport and binds the
/// use-case providers the feature declared.
List<Override> tasksOverrides({required Provider<Dio> dio}) {
  final repository = Provider<TaskRepository>(
    (ref) => TaskRepositoryImpl(TaskRemoteDataSource(ref.watch(dio))),
  );
  return [
    getTasksUseCaseProvider.overrideWith(
      (ref) => GetTasksUseCaseImpl(ref.watch(repository)),
    ),
    createTaskUseCaseProvider.overrideWith(
      (ref) => CreateTaskUseCaseImpl(ref.watch(repository)),
    ),
    updateTaskUseCaseProvider.overrideWith(
      (ref) => UpdateTaskUseCaseImpl(ref.watch(repository)),
    ),
    toggleTaskStatusUseCaseProvider.overrideWith(
      (ref) => ToggleTaskStatusUseCaseImpl(ref.watch(repository)),
    ),
    deleteTaskUseCaseProvider.overrideWith(
      (ref) => DeleteTaskUseCaseImpl(ref.watch(repository)),
    ),
  ];
}
