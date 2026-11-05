import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tasks_mobile/core/failures/app_failure.dart';
import 'package:tasks_mobile/features/auth/presentation/providers/auth_use_case_providers.dart';
import 'package:tasks_mobile/features/auth/presentation/session/auth_session.dart';

import '../auth_fakes.dart';

void main() {
  test('starts loading then resolves to the saved user', () async {
    final container = ProviderContainer.test(
      overrides: [
        getCurrentUserUseCaseProvider.overrideWithValue(
          FakeGetCurrentUserUseCase(demoUser),
        ),
      ],
    );

    expect(container.read(authSessionProvider).isLoading, isTrue);
    expect(await container.read(authSessionProvider.future), demoUser);
    expect(container.read(authSessionProvider).value, demoUser);
  });

  test('signOut calls logout once and leaves value null', () async {
    final logout = FakeLogoutUseCase();
    final container = ProviderContainer.test(
      overrides: [
        getCurrentUserUseCaseProvider.overrideWithValue(
          FakeGetCurrentUserUseCase(demoUser),
        ),
        logoutUseCaseProvider.overrideWithValue(logout),
      ],
    );
    await container.read(authSessionProvider.future);

    await container.read(authSessionProvider.notifier).signOut();

    expect(logout.calls, 1);
    expect(container.read(authSessionProvider).value, isNull);
  });

  test('a failing getCurrentUser becomes an error state', () async {
    final getCurrentUser = FakeGetCurrentUserUseCase()
      ..failWith = const NetworkFailure();
    final container = ProviderContainer.test(
      overrides: [
        getCurrentUserUseCaseProvider.overrideWithValue(getCurrentUser),
      ],
    );

    await expectLater(
      container.read(authSessionProvider.future),
      throwsA(isA<NetworkFailure>()),
    );
    expect(container.read(authSessionProvider).hasError, isTrue);
  });
}
