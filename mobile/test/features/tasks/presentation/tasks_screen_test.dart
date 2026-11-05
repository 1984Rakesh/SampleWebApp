import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tasks_mobile/core/failures/app_failure.dart';
import 'package:tasks_mobile/features/tasks/presentation/providers/task_use_case_providers.dart';
import 'package:tasks_mobile/features/tasks/presentation/screens/tasks_screen.dart';

import '../tasks_fakes.dart';

Widget host(FakeGetTasksUseCase getTasks) => ProviderScope(
  overrides: [getTasksUseCaseProvider.overrideWithValue(getTasks)],
  child: MaterialApp(home: TasksScreen(onSignOut: () {})),
);

void main() {
  testWidgets('shows the loaded task titles', (tester) async {
    await tester.pumpWidget(host(FakeGetTasksUseCase([sampleTask])));
    await tester.pumpAndSettle();

    expect(find.text('Buy milk'), findsOneWidget);
    expect(find.text('To do'), findsOneWidget);
  });

  testWidgets('no tasks shows the empty message', (tester) async {
    await tester.pumpWidget(host(FakeGetTasksUseCase()));
    await tester.pumpAndSettle();

    expect(find.text('No tasks yet'), findsOneWidget);
  });

  testWidgets('an error shows the message and Try again reloads', (
    tester,
  ) async {
    final getTasks = FakeGetTasksUseCase([sampleTask])
      ..failWith = const UnknownFailure();
    await tester.pumpWidget(host(getTasks));
    await tester.pumpAndSettle();

    expect(
      find.text('Something went wrong. Please try again.'),
      findsOneWidget,
    );

    getTasks.failWith = null;
    await tester.tap(find.text('Try again'));
    await tester.pumpAndSettle();

    expect(find.text('Buy milk'), findsOneWidget);
  });
}
