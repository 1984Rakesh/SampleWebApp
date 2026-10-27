import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tasks_mobile/app/providers.dart';
import 'package:tasks_mobile/core/network/api_client.dart';

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
}
