import 'package:dio/dio.dart';
import 'package:flutter_riverpod/misc.dart' show Override;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../core/network/api_client.dart';
import '../core/storage/token_storage.dart';
import '../features/auth/data/datasources/auth_remote_data_source.dart';
import '../features/auth/data/repositories/auth_repository_impl.dart';
import '../features/auth/domain/repositories/auth_repository.dart';
import '../features/auth/domain/use_cases/login_use_case.dart';
import '../features/auth/domain/use_cases/get_current_user_use_case.dart';
import '../features/auth/domain/use_cases/logout_use_case.dart';
import '../features/auth/presentation/providers/auth_use_case_providers.dart';

final tokenStorageProvider = Provider<TokenStorage>(
  (ref) => SecureTokenStorage(const FlutterSecureStorage()),
);

final dioProvider = Provider<Dio>((ref) {
  final dio = createDio(tokenStorage: ref.watch(tokenStorageProvider));
  ref.onDispose(dio.close);
  return dio;
});

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return AuthRepositoryImpl(
    AuthRemoteDataSource(dio),
    ref.watch(tokenStorageProvider),
  );
});

/// Binds each feature's use-case providers to the real Impls.
/// main.dart passes this list to ProviderScope.
final List<Override> appOverrides = [
  loginUseCaseProvider.overrideWith(
    (ref) => LoginUseCaseImpl(ref.watch(authRepositoryProvider)),
  ),
  getCurrentUserUseCaseProvider.overrideWith(
    (ref) => GetCurrentUserUseCaseImpl(ref.watch(authRepositoryProvider)),
  ),
  logoutUseCaseProvider.overrideWith(
    (ref) => LogoutUseCaseImpl(ref.watch(authRepositoryProvider)),
  ),
];
