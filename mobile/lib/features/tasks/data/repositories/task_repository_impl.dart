import 'package:dio/dio.dart';

import '../../../../core/failures/app_failure.dart';
import '../../../../core/network/api_client.dart';
import '../../domain/entities/task.dart';
import '../../domain/entities/task_params.dart';
import '../../domain/entities/task_status.dart';
import '../../domain/repositories/task_repository.dart';
import '../datasources/task_remote_data_source.dart';
import '../mappers/task_mapper.dart';

final class TaskRepositoryImpl implements TaskRepository {
  const TaskRepositoryImpl(this._remote);

  final TaskRemoteDataSource _remote;

  @override
  Future<List<Task>> getTasks(GetTasksParams params) => _guard(() async {
    final dtos = await _remote.fetchTasks(taskQuery(params));
    return [for (final dto in dtos) dto.toDomain()];
  });

  @override
  Future<Task> createTask(CreateTaskParams params) => _guard(() async {
    final dto = await _remote.createTask(createTaskBody(params));
    return dto.toDomain();
  });

  @override
  Future<Task> updateTask(UpdateTaskParams params) => _guard(() async {
    final dto = await _remote.updateTask(params.id, updateTaskBody(params));
    return dto.toDomain();
  });

  @override
  Future<Task> setStatus({required String id, required TaskStatus status}) =>
      _guard(() async {
        final dto = await _remote.updateStatus(id, status.wire);
        return dto.toDomain();
      });

  @override
  Future<void> deleteTask(String id) => _guard(() => _remote.deleteTask(id));

  /// Runs [call] and turns transport and shape errors into [AppFailure]s,
  /// so nothing else ever leaves the data layer.
  Future<T> _guard<T>(Future<T> Function() call) async {
    try {
      return await call();
    } on DioException catch (e) {
      throw mapDioException(e);
    } on FormatException {
      throw const UnknownFailure();
    }
  }
}
