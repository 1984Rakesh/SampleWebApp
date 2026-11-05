import 'package:flutter_test/flutter_test.dart';
import 'package:tasks_mobile/features/tasks/data/dtos/task_dto.dart';
import 'package:tasks_mobile/features/tasks/data/mappers/task_mapper.dart';
import 'package:tasks_mobile/features/tasks/domain/entities/patch.dart';
import 'package:tasks_mobile/features/tasks/domain/entities/task.dart';
import 'package:tasks_mobile/features/tasks/domain/entities/task_params.dart';
import 'package:tasks_mobile/features/tasks/domain/entities/task_priority.dart';
import 'package:tasks_mobile/features/tasks/domain/entities/task_status.dart';

const taskJson = {
  'id': 'task-1',
  'title': 'Buy milk',
  'description': null,
  'status': 'IN_PROGRESS',
  'priority': 'HIGH',
  'dueDate': '2026-11-20',
  'userId': 'user-1',
  'createdAt': '2026-11-01T09:00:00.000Z',
  'updatedAt': '2026-11-01T09:00:00.000Z',
};

void main() {
  test('a server task becomes a domain Task', () {
    final task = TaskDto.fromJson(taskJson).toDomain();

    expect(
      task,
      Task(
        id: 'task-1',
        title: 'Buy milk',
        status: TaskStatus.inProgress,
        priority: TaskPriority.high,
        dueDate: DateTime(2026, 11, 20),
      ),
    );
  });

  test('an unknown status or a wrong shape is a FormatException', () {
    expect(
      () => TaskDto.fromJson({...taskJson, 'status': 'DONE'}).toDomain(),
      throwsFormatException,
    );
    expect(() => TaskDto.fromJson({'id': 1}), throwsFormatException);
    expect(() => TaskDto.fromJson('not a map'), throwsFormatException);
  });

  test('every status and priority has a wire spelling', () {
    expect(TaskStatus.values.map((s) => s.wire), [
      'TODO',
      'IN_PROGRESS',
      'COMPLETED',
    ]);
    expect(TaskPriority.values.map((p) => p.wire), ['LOW', 'MEDIUM', 'HIGH']);
  });

  test('the create body leaves out empty fields and formats the date', () {
    expect(createTaskBody(const CreateTaskParams(title: 'Buy milk')), {
      'title': 'Buy milk',
    });
    expect(
      createTaskBody(
        CreateTaskParams(
          title: 'Buy milk',
          priority: TaskPriority.low,
          dueDate: DateTime(2026, 1, 5),
        ),
      ),
      {'title': 'Buy milk', 'priority': 'LOW', 'dueDate': '2026-01-05'},
    );
  });

  test(
    'the update body sends Keep as nothing, Clear as null, SetTo as value',
    () {
      final body = updateTaskBody(
        UpdateTaskParams(
          id: 'task-1',
          title: 'Milk',
          description: const Clear(),
          dueDate: SetTo(DateTime(2026, 12, 1)),
        ),
      );

      expect(body, {
        'title': 'Milk',
        'description': null,
        'dueDate': '2026-12-01',
      });
      expect(updateTaskBody(const UpdateTaskParams(id: 'task-1')), isEmpty);
    },
  );
}
