import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/misc.dart' show Override;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../core/network/api_client.dart';
import '../core/storage/token_storage.dart';
import 'composition/auth_overrides.dart';
import 'composition/tasks_overrides.dart';

/// Composition root: the only place that picks concrete classes.

final tokenStorageProvider = Provider<TokenStorage>(
  (ref) => SecureTokenStorage(const FlutterSecureStorage()),
);

final dioProvider = Provider<Dio>((ref) {
  final dio = createDio(tokenStorage: ref.watch(tokenStorageProvider));
  ref.onDispose(dio.close);
  return dio;
});

/// One assembly per feature, given only the shared pieces it needs.
/// main.dart passes this list to ProviderScope.
final List<Override> appOverrides = [
  ...authOverrides(dio: dioProvider, tokenStorage: tokenStorageProvider),
  ...tasksOverrides(dio: dioProvider),
];
