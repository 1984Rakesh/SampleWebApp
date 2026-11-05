import '../../../../core/use_case/use_case.dart';

import '../entities/task.dart';
import '../entities/task_params.dart';
import '../repositories/task_repository.dart';
import 'task_rules.dart';

/// Advance a task to its next status (todo → inProgress → completed → todo).
abstract interface class ToggleTaskStatusUseCase
    implements UseCase<Task, ToggleTaskStatusParams> {}

final class ToggleTaskStatusUseCaseImpl implements ToggleTaskStatusUseCase {
  const ToggleTaskStatusUseCaseImpl(this._repository);

  final TaskRepository _repository;

  @override
  Future<Task> call(ToggleTaskStatusParams params) async {
    TaskRules.requireId(params.id);
    return _repository.setStatus(id: params.id, status: params.current.next);
  }
}
