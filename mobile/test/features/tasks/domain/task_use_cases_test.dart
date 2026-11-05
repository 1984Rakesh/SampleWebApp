import 'package:flutter_test/flutter_test.dart';
import 'package:tasks_mobile/core/failures/app_failure.dart';
import 'package:tasks_mobile/features/tasks/domain/entities/patch.dart';
import 'package:tasks_mobile/features/tasks/domain/entities/task.dart';
import 'package:tasks_mobile/features/tasks/domain/entities/task_params.dart';
import 'package:tasks_mobile/features/tasks/domain/entities/task_priority.dart';
import 'package:tasks_mobile/features/tasks/domain/entities/task_status.dart';
import 'package:tasks_mobile/features/tasks/domain/repositories/task_repository.dart';
import 'package:tasks_mobile/features/tasks/domain/use_cases/create_task_use_case.dart';
import 'package:tasks_mobile/features/tasks/domain/use_cases/delete_task_use_case.dart';
import 'package:tasks_mobile/features/tasks/domain/use_cases/get_tasks_use_case.dart';
import 'package:tasks_mobile/features/tasks/domain/use_cases/toggle_task_status_use_case.dart';
import 'package:tasks_mobile/features/tasks/domain/use_cases/update_task_use_case.dart';

const sampleTask = Task(
  id: 'task-1',
  title: 'Sample',
  status: TaskStatus.todo,
  priority: TaskPriority.medium,
);

/// Records the last call of each method so tests can check what the use
/// cases forwarded, without a mocking framework.
class FakeTaskRepository implements TaskRepository {
  GetTasksParams? lastFilter;
  CreateTaskParams? lastCreate;
  UpdateTaskParams? lastUpdate;
  ({String id, TaskStatus status})? lastStatus;
  String? deletedId;

  @override
  Future<List<Task>> getTasks(GetTasksParams params) {
    lastFilter = params;
    return Future.value(const [sampleTask]);
  }

  @override
  Future<Task> createTask(CreateTaskParams params) {
    lastCreate = params;
    return Future.value(sampleTask);
  }

  @override
  Future<Task> updateTask(UpdateTaskParams params) {
    lastUpdate = params;
    return Future.value(sampleTask);
  }

  @override
  Future<Task> setStatus({required String id, required TaskStatus status}) {
    lastStatus = (id: id, status: status);
    return Future.value(sampleTask);
  }

  @override
  Future<void> deleteTask(String id) {
    deletedId = id;
    return Future.value();
  }
}

void main() {
  late FakeTaskRepository repository;

  // Runs before every test, so each one starts with a fresh fake.
  setUp(() => repository = FakeTaskRepository());

  test('GetTasksUseCaseImpl passes the filter through', () async {
    final GetTasksUseCase getTasks = GetTasksUseCaseImpl(repository);
    const filter = GetTasksParams(
      status: TaskStatus.todo,
      priority: TaskPriority.high,
    );

    final tasks = await getTasks(filter);

    expect(tasks, const [sampleTask]);
    expect(repository.lastFilter, same(filter));
  });

  group('CreateTaskUseCaseImpl', () {
    test('trims the title and drops a blank description', () async {
      final CreateTaskUseCase create = CreateTaskUseCaseImpl(repository);

      await create(
        const CreateTaskParams(title: '  Buy milk ', description: '   '),
      );

      expect(repository.lastCreate?.title, 'Buy milk');
      expect(repository.lastCreate?.description, isNull);
    });

    test('rejects a blank title without calling the repository', () async {
      final CreateTaskUseCase create = CreateTaskUseCaseImpl(repository);

      await expectLater(
        create(const CreateTaskParams(title: '   ')),
        throwsA(isA<ValidationFailure>()),
      );
      expect(repository.lastCreate, isNull);
    });
  });

  group('UpdateTaskUseCaseImpl', () {
    test('keeps untouched fields and trims the title', () async {
      final UpdateTaskUseCase update = UpdateTaskUseCaseImpl(repository);

      await update(const UpdateTaskParams(id: 'task-1', title: '  New title '));

      final params = repository.lastUpdate!;
      expect(params.title, 'New title');
      expect(params.description, isA<Keep<String>>());
      expect(params.dueDate, isA<Keep<DateTime>>());
      expect(params.status, isNull);
      expect(params.priority, isNull);
    });

    test('turns a blank SetTo description into Clear', () async {
      final UpdateTaskUseCase update = UpdateTaskUseCaseImpl(repository);

      await update(
        const UpdateTaskParams(id: 'task-1', description: SetTo('  ')),
      );

      expect(repository.lastUpdate?.description, isA<Clear<String>>());
    });

    test('rejects an empty id without calling the repository', () async {
      final UpdateTaskUseCase update = UpdateTaskUseCaseImpl(repository);

      await expectLater(
        update(const UpdateTaskParams(id: '  ')),
        throwsA(isA<ValidationFailure>()),
      );
      expect(repository.lastUpdate, isNull);
    });
  });

  test('ToggleTaskStatusUseCaseImpl sends the next status', () async {
    final ToggleTaskStatusUseCase toggle = ToggleTaskStatusUseCaseImpl(
      repository,
    );

    await toggle(
      const ToggleTaskStatusParams(id: 'task-1', current: TaskStatus.todo),
    );

    expect(repository.lastStatus, (
      id: 'task-1',
      status: TaskStatus.inProgress,
    ));
  });

  test(
    'DeleteTaskUseCaseImpl rejects a blank id, then deletes a real one',
    () async {
      final DeleteTaskUseCase delete = DeleteTaskUseCaseImpl(repository);

      await expectLater(
        delete(const DeleteTaskParams(' ')),
        throwsA(isA<ValidationFailure>()),
      );
      expect(repository.deletedId, isNull);

      await delete(const DeleteTaskParams('task-1'));
      expect(repository.deletedId, 'task-1');
    },
  );
}
