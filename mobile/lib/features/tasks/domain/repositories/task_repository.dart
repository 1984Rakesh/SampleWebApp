import '../entities/task.dart';
import '../entities/task_params.dart';
import '../entities/task_status.dart';

/// What the domain needs from the outside world to manage tasks.
/// Concrete implementations (HTTP, local, fake) live in the data layer.
abstract interface class TaskRepository {
  Future<List<Task>> getTasks(GetTasksParams params);
  Future<Task> createTask(CreateTaskParams params);
  Future<Task> updateTask(UpdateTaskParams params);
  Future<Task> setStatus({required String id, required TaskStatus status});
  Future<void> deleteTask(String id);
}
