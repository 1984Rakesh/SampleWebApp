import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tasks_mobile/app/providers.dart';
import 'package:tasks_mobile/core/network/api_client.dart';
import 'package:tasks_mobile/features/auth/data/repositories/auth_repository_impl.dart';
import 'package:tasks_mobile/features/auth/domain/use_cases/login_use_case.dart';
import 'package:tasks_mobile/features/auth/presentation/providers/auth_use_case_providers.dart';

import '../core/network/api_client_test.dart' show FakeTokenStorage;

void main() {
  test('dio uses the base URL and the token from storage', () async {
    final container = ProviderContainer.test(
      overrides: [
        tokenStorageProvider.overrideWithValue(FakeTokenStorage('abc123')),
      ],
    );

    final dio = container.read(dioProvider);

    expect(dio.options.baseUrl, defaultApiBaseUrl());
    expect(dio.interceptors.whereType<AuthInterceptor>(), hasLength(1));
  });

  test('appOverrides bind the auth use cases to the real classes', () {
    final container = ProviderContainer.test(
      overrides: [
        ...appOverrides,
        tokenStorageProvider.overrideWithValue(FakeTokenStorage()),
      ],
    );

    expect(container.read(authRepositoryProvider), isA<AuthRepositoryImpl>());
    expect(container.read(loginUseCaseProvider), isA<LoginUseCaseImpl>());
  });
}
