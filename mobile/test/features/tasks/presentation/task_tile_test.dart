import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tasks_mobile/features/tasks/presentation/view_state/task_item_view_state.dart';
import 'package:tasks_mobile/features/tasks/presentation/widgets/task_tile.dart';

Widget host(Widget child) => MaterialApp(home: Scaffold(body: child));

const item = TaskItemViewState(
  id: 'task-1',
  title: 'Buy milk',
  statusLabel: 'To do',
  statusTone: StatusTone.todo,
  priorityLabel: 'Medium',
  priorityTone: PriorityTone.medium,
  dueLabel: 'Due Nov 20',
  isOverdue: false,
  isCompleted: false,
);

void main() {
  testWidgets('shows the title, status, priority and due labels', (
    tester,
  ) async {
    await tester.pumpWidget(host(const TaskTile(item: item)));

    expect(find.text('Buy milk'), findsOneWidget);
    expect(find.text('To do'), findsOneWidget);
    expect(find.text('Medium'), findsOneWidget);
    expect(find.text('Due Nov 20'), findsOneWidget);
  });

  testWidgets('tapping the checkbox calls onToggle', (tester) async {
    bool? toggled;
    await tester.pumpWidget(
      host(TaskTile(item: item, onToggle: (checked) => toggled = checked)),
    );

    await tester.tap(find.byType(Checkbox));
    expect(toggled, isTrue);
  });
}
