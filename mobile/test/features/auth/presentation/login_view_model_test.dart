import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:tasks_mobile/core/failures/app_failure.dart';
import 'package:tasks_mobile/features/auth/presentation/providers/auth_use_case_providers.dart';
import 'package:tasks_mobile/features/auth/presentation/session/auth_session.dart';
import 'package:tasks_mobile/features/auth/presentation/view_models/login_view_model.dart';

import '../auth_fakes.dart';

void main() {
  late FakeLoginUseCase login;
  late ProviderContainer container;

  setUp(() async {
    login = FakeLoginUseCase();
    container = ProviderContainer.test(
      overrides: [
        loginUseCaseProvider.overrideWithValue(login),
        getCurrentUserUseCaseProvider.overrideWithValue(
          FakeGetCurrentUserUseCase(),
        ),
      ],
    );
    container.listen(loginViewModelProvider, (_, _) {});
    await container.read(authSessionProvider.future);
  });

  LoginViewModel viewModel() => container.read(loginViewModelProvider.notifier);

  test('starts empty and cannot submit', () {
    final state = container.read(loginViewModelProvider);

    expect(state.email, '');
    expect(state.canSubmit, isFalse);
  });

  test('submits what was typed and signs the session in', () async {
    viewModel()
      ..emailChanged('demo@example.com')
      ..passwordChanged('password123');

    await viewModel().submit();

    expect(login.lastParams?.email, 'demo@example.com');
    expect(login.lastParams?.password, 'password123');
    final state = container.read(loginViewModelProvider);
    expect(state.isSubmitting, isFalse);
    expect(container.read(authSessionProvider).value, demoUser);
  });

  test('shows the failure message and lets you try again', () async {
    login.failWith = const ValidationFailure('Wrong email or password.');
    viewModel()
      ..emailChanged('demo@example.com')
      ..passwordChanged('nope');

    await viewModel().submit();

    final state = container.read(loginViewModelProvider);
    expect(state.errorMessage, 'Wrong email or password.');
    expect(state.canSubmit, isTrue);
    expect(container.read(authSessionProvider).value, isNull);

    viewModel().passwordChanged('nope2');
    expect(container.read(loginViewModelProvider).errorMessage, isNull);
  });
}
