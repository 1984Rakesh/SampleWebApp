import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:tasks_mobile/features/auth/domain/use_cases/login_use_case.dart';
import 'package:tasks_mobile/features/auth/domain/entities/user.dart';
import 'package:tasks_mobile/features/auth/presentation/providers/auth_use_case_providers.dart';
import 'package:tasks_mobile/core/failures/app_failure.dart';
import 'package:tasks_mobile/features/auth/presentation/view_models/login_view_model.dart';

class FakeLoginUseCase implements LoginUseCase {
  AppFailure? failWith;
  LoginParams? lastParams;

  @override
  Future<User> call(LoginParams params) {
    lastParams = params;
    if (failWith case final failure?) throw failure;
    return Future.value(
      const User(id: 'user-1', name: 'Demo', email: 'demo@example.com'),
    );
  }
}

void main() {
  late FakeLoginUseCase login;
  late ProviderContainer container;

  setUp(() {
    login = FakeLoginUseCase();
    container = ProviderContainer.test(
      overrides: [loginUseCaseProvider.overrideWithValue(login)],
    );
  });

  LoginViewModel viewModel() => container.read(loginViewModelProvider.notifier);

  test('starts empty and cannot submit', () {
    final state = container.read(loginViewModelProvider);

    expect(state.email, '');
    expect(state.canSubmit, isFalse);
  });

  test('submits what was typed and ends signed in', () async {
    viewModel()
      ..emailChanged('demo@example.com')
      ..passwordChanged('password123');

    await viewModel().submit();

    expect(login.lastParams?.email, 'demo@example.com');
    expect(login.lastParams?.password, 'password123');
    final state = container.read(loginViewModelProvider);
    expect(state.isSignedIn, isTrue);
    expect(state.isSubmitting, isFalse);
  });

  test('shows the failure message and lets you try again', () async {
    login.failWith = const ValidationFailure('Wrong email or password.');
    viewModel()
      ..emailChanged('demo@example.com')
      ..passwordChanged('nope');

    await viewModel().submit();

    final state = container.read(loginViewModelProvider);
    expect(state.errorMessage, 'Wrong email or password.');
    expect(state.isSignedIn, isFalse);
    expect(state.canSubmit, isTrue);

    viewModel().passwordChanged('nope2');
    expect(container.read(loginViewModelProvider).errorMessage, isNull);
  });
}
