import '../../../../core/use_case/use_case.dart';

import '../entities/task.dart';
import '../entities/task_params.dart';
import '../repositories/task_repository.dart';

/// List tasks, optionally filtered by status and/or priority.
abstract interface class GetTasksUseCase
    implements UseCase<List<Task>, GetTasksParams> {}

final class GetTasksUseCaseImpl implements GetTasksUseCase {
  const GetTasksUseCaseImpl(this._repository);

  final TaskRepository _repository;

  @override
  Future<List<Task>> call(GetTasksParams params) async {
    return _repository.getTasks(params);
  }
}
