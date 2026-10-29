import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:tasks_mobile/features/auth/presentation/screens/login_screen.dart';
import 'package:tasks_mobile/core/failures/app_failure.dart';
import 'package:tasks_mobile/features/auth/presentation/providers/auth_use_case_providers.dart';

import 'login_view_model_test.dart' show FakeLoginUseCase;

void main() {
  testWidgets('typing and tapping Sign in shows the server error', (
    tester,
  ) async {
    final login = FakeLoginUseCase()
      ..failWith = const ValidationFailure('Wrong email or password.');
    await tester.pumpWidget(
      ProviderScope(
        overrides: [loginUseCaseProvider.overrideWithValue(login)],
        child: const MaterialApp(home: LoginScreen()),
      ),
    );

    await tester.enterText(find.byType(TextField).at(0), 'demo@example.com');
    await tester.enterText(find.byType(TextField).at(1), 'nope');
    // Rebuild so the button sees canSubmit == true.
    await tester.pump();
    await tester.tap(find.text('Sign in'));
    await tester.pumpAndSettle();

    expect(find.text('Wrong email or password.'), findsOneWidget);
    expect(login.lastParams?.email, 'demo@example.com');
  });
}
