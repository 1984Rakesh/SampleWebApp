import 'package:tasks_mobile/core/failures/app_failure.dart';
import 'package:tasks_mobile/features/tasks/domain/entities/task.dart';
import 'package:tasks_mobile/features/tasks/domain/entities/task_params.dart';
import 'package:tasks_mobile/features/tasks/domain/entities/task_priority.dart';
import 'package:tasks_mobile/features/tasks/domain/entities/task_status.dart';
import 'package:tasks_mobile/features/tasks/domain/use_cases/get_tasks_use_case.dart';

const sampleTask = Task(
  id: 'task-1',
  title: 'Buy milk',
  status: TaskStatus.todo,
  priority: TaskPriority.medium,
);

class FakeGetTasksUseCase implements GetTasksUseCase {
  FakeGetTasksUseCase([this.tasks = const []]);

  List<Task> tasks;
  AppFailure? failWith;
  int calls = 0;

  @override
  Future<List<Task>> call(GetTasksParams params) async {
    calls++;
    if (failWith case final failure?) throw failure;
    return tasks;
  }
}
