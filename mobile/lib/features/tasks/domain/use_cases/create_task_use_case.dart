import '../../../../core/use_case/use_case.dart';

import '../entities/task.dart';
import '../entities/task_params.dart';
import '../repositories/task_repository.dart';
import 'task_rules.dart';

/// Create a task after normalizing its input.
abstract interface class CreateTaskUseCase
    implements UseCase<Task, CreateTaskParams> {}

final class CreateTaskUseCaseImpl implements CreateTaskUseCase {
  const CreateTaskUseCaseImpl(this._repository);

  final TaskRepository _repository;

  @override
  Future<Task> call(CreateTaskParams params) async {
    return _repository.createTask(
      CreateTaskParams(
        title: TaskRules.title(params.title),
        description: TaskRules.optionalText(params.description),
        priority: params.priority,
        dueDate: params.dueDate,
      ),
    );
  }
}
