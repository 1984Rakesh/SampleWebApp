import 'package:dio/dio.dart';

import '../dtos/task_dto.dart';

/// Talks to /api/tasks. Takes and returns transport shapes only.
class TaskRemoteDataSource {
  const TaskRemoteDataSource(this._dio);

  final Dio _dio;

  Future<List<TaskDto>> fetchTasks(Map<String, String> query) async {
    final response = await _dio.get<List<dynamic>>(
      '/tasks',
      queryParameters: query,
    );
    return (response.data ?? const []).map(TaskDto.fromJson).toList();
  }

  Future<TaskDto> createTask(Map<String, Object?> body) async {
    final response = await _dio.post<Map<String, dynamic>>(
      '/tasks',
      data: body,
    );
    return TaskDto.fromJson(response.data);
  }

  Future<TaskDto> updateTask(String id, Map<String, Object?> body) async {
    final response = await _dio.put<Map<String, dynamic>>(
      '/tasks/$id',
      data: body,
    );
    return TaskDto.fromJson(response.data);
  }

  Future<TaskDto> updateStatus(String id, String status) async {
    final response = await _dio.patch<Map<String, dynamic>>(
      '/tasks/$id/status',
      data: {'status': status},
    );
    return TaskDto.fromJson(response.data);
  }

  Future<void> deleteTask(String id) => _dio.delete<void>('/tasks/$id');
}
