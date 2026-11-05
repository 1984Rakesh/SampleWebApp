import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tasks_mobile/app/app.dart';
import 'package:tasks_mobile/app/router.dart';
import 'package:tasks_mobile/features/auth/presentation/providers/auth_use_case_providers.dart';
import 'package:tasks_mobile/features/tasks/presentation/providers/task_use_case_providers.dart';

import '../features/auth/auth_fakes.dart';
import '../features/tasks/tasks_fakes.dart';

void main() {
  group('authRedirect', () {
    test('a loading session goes to / unless already there', () {
      expect(authRedirect(isSignedIn: null, location: '/login'), '/');
      expect(authRedirect(isSignedIn: null, location: '/'), isNull);
    });

    test('signed out goes to /login unless already there', () {
      expect(authRedirect(isSignedIn: false, location: '/tasks'), '/login');
      expect(authRedirect(isSignedIn: false, location: '/login'), isNull);
    });

    test('signed in leaves /login and / for /tasks', () {
      expect(authRedirect(isSignedIn: true, location: '/login'), '/tasks');
      expect(authRedirect(isSignedIn: true, location: '/'), '/tasks');
    });

    test('signed in stays on /tasks', () {
      expect(authRedirect(isSignedIn: true, location: '/tasks'), isNull);
    });
  });

  testWidgets('signed out opens on Welcome back', (tester) async {
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          getCurrentUserUseCaseProvider.overrideWithValue(
            FakeGetCurrentUserUseCase(),
          ),
        ],
        child: const TasksApp(),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Welcome back'), findsOneWidget);
  });

  testWidgets('signed in opens on Tasks and sign out returns to login', (
    tester,
  ) async {
    final logout = FakeLogoutUseCase();
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          getCurrentUserUseCaseProvider.overrideWithValue(
            FakeGetCurrentUserUseCase(demoUser),
          ),
          logoutUseCaseProvider.overrideWithValue(logout),
          getTasksUseCaseProvider.overrideWithValue(FakeGetTasksUseCase()),
        ],
        child: const TasksApp(),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Tasks'), findsOneWidget);

    await tester.tap(find.byTooltip('Sign out'));
    await tester.pumpAndSettle();

    expect(logout.calls, 1);
    expect(find.text('Welcome back'), findsOneWidget);
  });

  testWidgets('entering credentials and tapping Sign in lands on Tasks', (
    tester,
  ) async {
    final login = FakeLoginUseCase();
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          getCurrentUserUseCaseProvider.overrideWithValue(
            FakeGetCurrentUserUseCase(),
          ),
          loginUseCaseProvider.overrideWithValue(login),
          getTasksUseCaseProvider.overrideWithValue(FakeGetTasksUseCase()),
        ],
        child: const TasksApp(),
      ),
    );
    await tester.pumpAndSettle();

    await tester.enterText(find.byType(TextField).at(0), 'demo@example.com');
    await tester.enterText(find.byType(TextField).at(1), 'password123');
    await tester.pump();
    await tester.tap(find.text('Sign in'));
    await tester.pumpAndSettle();

    expect(find.text('Tasks'), findsOneWidget);
  });
}
