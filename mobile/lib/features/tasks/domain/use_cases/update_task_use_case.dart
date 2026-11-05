import '../../../../core/use_case/use_case.dart';

import '../entities/task.dart';
import '../entities/task_params.dart';
import '../repositories/task_repository.dart';
import 'task_rules.dart';

/// Apply a partial update: null keeps scalar fields, [Patch] steers the
/// nullable ones.
abstract interface class UpdateTaskUseCase
    implements UseCase<Task, UpdateTaskParams> {}

final class UpdateTaskUseCaseImpl implements UpdateTaskUseCase {
  const UpdateTaskUseCaseImpl(this._repository);

  final TaskRepository _repository;

  @override
  Future<Task> call(UpdateTaskParams params) async {
    TaskRules.requireId(params.id);
    final title = switch (params.title) {
      final title? => TaskRules.title(title),
      null => null,
    };
    return _repository.updateTask(
      UpdateTaskParams(
        id: params.id,
        title: title,
        description: TaskRules.textPatch(params.description),
        status: params.status,
        priority: params.priority,
        dueDate: params.dueDate,
      ),
    );
  }
}
