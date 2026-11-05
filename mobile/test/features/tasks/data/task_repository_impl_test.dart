import 'package:flutter_test/flutter_test.dart';
import 'package:tasks_mobile/core/failures/app_failure.dart';
import 'package:tasks_mobile/features/tasks/data/datasources/task_remote_data_source.dart';
import 'package:tasks_mobile/features/tasks/data/repositories/task_repository_impl.dart';
import 'package:tasks_mobile/features/tasks/domain/entities/patch.dart';
import 'package:tasks_mobile/features/tasks/domain/entities/task_params.dart';
import 'package:tasks_mobile/features/tasks/domain/entities/task_status.dart';

import '../../auth/data/auth_repository_impl_test.dart' show FakeServer;
import 'task_mapper_test.dart' show taskJson;

void main() {
  late FakeServer server;
  late TaskRepositoryImpl repository;

  setUp(() {
    server = FakeServer();
    repository = TaskRepositoryImpl(TaskRemoteDataSource(server.dio));
  });

  test('getTasks sends the filter as query parameters', () async {
    server.answer = (_) => (200, [taskJson]);

    final tasks = await repository.getTasks(
      const GetTasksParams(status: TaskStatus.completed),
    );

    final request = server.requests.single;
    expect(request.method, 'GET');
    expect(request.path, '/tasks');
    expect(request.queryParameters, {'status': 'COMPLETED'});
    expect(tasks.single.title, 'Buy milk');
  });

  test('createTask posts the body and returns the new task', () async {
    server.answer = (_) => (201, taskJson);

    final task = await repository.createTask(
      const CreateTaskParams(title: 'Buy milk'),
    );

    final request = server.requests.single;
    expect(request.method, 'POST');
    expect(request.data, {'title': 'Buy milk'});
    expect(task.id, 'task-1');
  });

  test('updateTask puts only the changed fields', () async {
    server.answer = (_) => (200, taskJson);

    await repository.updateTask(
      const UpdateTaskParams(id: 'task-1', description: Clear()),
    );

    final request = server.requests.single;
    expect(request.method, 'PUT');
    expect(request.path, '/tasks/task-1');
    expect(request.data, {'description': null});
  });

  test('setStatus patches the status endpoint', () async {
    server.answer = (_) => (200, taskJson);

    await repository.setStatus(id: 'task-1', status: TaskStatus.completed);

    final request = server.requests.single;
    expect(request.method, 'PATCH');
    expect(request.path, '/tasks/task-1/status');
    expect(request.data, {'status': 'COMPLETED'});
  });

  test('deleteTask sends DELETE and accepts an empty 204', () async {
    server.answer = (_) => (204, null);

    await repository.deleteTask('task-1');

    expect(server.requests.single.method, 'DELETE');
    expect(server.requests.single.path, '/tasks/task-1');
  });

  test('a 404 becomes NotFoundFailure', () async {
    server.answer = (_) => (404, {'error': 'Task not found'});

    await expectLater(
      repository.deleteTask('missing'),
      throwsA(isA<NotFoundFailure>()),
    );
  });

  test('a malformed task in the list becomes UnknownFailure', () async {
    server.answer = (_) => (
      200,
      [
        {'id': 'task-1'},
      ],
    );

    await expectLater(
      repository.getTasks(const GetTasksParams()),
      throwsA(isA<UnknownFailure>()),
    );
  });
}
