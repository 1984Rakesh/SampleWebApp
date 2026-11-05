import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/misc.dart' show Override;

import '../../core/storage/token_storage.dart';
import '../../features/auth/data/datasources/auth_remote_data_source.dart';
import '../../features/auth/data/repositories/auth_repository_impl.dart';
import '../../features/auth/domain/repositories/auth_repository.dart';
import '../../features/auth/domain/use_cases/get_current_user_use_case.dart';
import '../../features/auth/domain/use_cases/login_use_case.dart';
import '../../features/auth/domain/use_cases/logout_use_case.dart';
import '../../features/auth/presentation/providers/auth_use_case_providers.dart';

/// Builds the auth feature from the shared transport and token storage and
/// binds the use-case providers the feature declared.
List<Override> authOverrides({
  required Provider<Dio> dio,
  required Provider<TokenStorage> tokenStorage,
}) {
  final repository = Provider<AuthRepository>(
    (ref) => AuthRepositoryImpl(
      AuthRemoteDataSource(ref.watch(dio)),
      ref.watch(tokenStorage),
    ),
  );
  return [
    loginUseCaseProvider.overrideWith(
      (ref) => LoginUseCaseImpl(ref.watch(repository)),
    ),
    getCurrentUserUseCaseProvider.overrideWith(
      (ref) => GetCurrentUserUseCaseImpl(ref.watch(repository)),
    ),
    logoutUseCaseProvider.overrideWith(
      (ref) => LogoutUseCaseImpl(ref.watch(repository)),
    ),
  ];
}
