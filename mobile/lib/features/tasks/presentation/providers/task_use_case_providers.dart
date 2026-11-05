import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../domain/use_cases/create_task_use_case.dart';
import '../../domain/use_cases/delete_task_use_case.dart';
import '../../domain/use_cases/get_tasks_use_case.dart';
import '../../domain/use_cases/toggle_task_status_use_case.dart';
import '../../domain/use_cases/update_task_use_case.dart';

// What the tasks screens need, declared by the feature itself.
// `app/` binds the real classes (tasksOverrides); tests bind fakes.

final getTasksUseCaseProvider = Provider<GetTasksUseCase>(
  (ref) =>
      throw UnimplementedError('app/ must override getTasksUseCaseProvider'),
);

final createTaskUseCaseProvider = Provider<CreateTaskUseCase>(
  (ref) =>
      throw UnimplementedError('app/ must override createTaskUseCaseProvider'),
);

final updateTaskUseCaseProvider = Provider<UpdateTaskUseCase>(
  (ref) =>
      throw UnimplementedError('app/ must override updateTaskUseCaseProvider'),
);

final toggleTaskStatusUseCaseProvider = Provider<ToggleTaskStatusUseCase>(
  (ref) => throw UnimplementedError(
    'app/ must override toggleTaskStatusUseCaseProvider',
  ),
);

final deleteTaskUseCaseProvider = Provider<DeleteTaskUseCase>(
  (ref) =>
      throw UnimplementedError('app/ must override deleteTaskUseCaseProvider'),
);
