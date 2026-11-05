import '../../../../core/use_case/use_case.dart';

import '../entities/task_params.dart';
import '../repositories/task_repository.dart';
import 'task_rules.dart';

/// Delete a task by id.
abstract interface class DeleteTaskUseCase
    implements UseCase<void, DeleteTaskParams> {}

final class DeleteTaskUseCaseImpl implements DeleteTaskUseCase {
  const DeleteTaskUseCaseImpl(this._repository);

  final TaskRepository _repository;

  @override
  Future<void> call(DeleteTaskParams params) async {
    TaskRules.requireId(params.id);
    return _repository.deleteTask(params.id);
  }
}
