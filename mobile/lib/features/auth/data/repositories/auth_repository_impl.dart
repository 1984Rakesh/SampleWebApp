import 'package:dio/dio.dart';
import 'package:tasks_mobile/core/failures/app_failure.dart';
import 'package:tasks_mobile/core/network/api_client.dart';
import 'package:tasks_mobile/core/storage/token_storage.dart';
import 'package:tasks_mobile/features/auth/data/datasources/auth_remote_data_source.dart';
import 'package:tasks_mobile/features/auth/data/mappers/user_mapper.dart';
import 'package:tasks_mobile/features/auth/domain/entities/user.dart';
import 'package:tasks_mobile/features/auth/domain/repositories/auth_repository.dart';

final class AuthRepositoryImpl implements AuthRepository {
  const AuthRepositoryImpl(this._remote, this._tokenStorage);

  final AuthRemoteDataSource _remote;
  final TokenStorage _tokenStorage;

  @override
  Future<User> login({required String email, required String password}) async {
    try {
      final dto = await _remote.login(email: email, password: password);
      await _tokenStorage.saveTokens(
        accessToken: dto.accessToken,
        refreshToken: dto.refreshToken,
      );
      return dto.user.toDomain();
    } on DioException catch (e) {
      // On the login call, 401 means wrong credentials, not "session ended".
      if (e.response?.statusCode == 401) {
        throw const ValidationFailure('Wrong email or password.');
      }
      throw mapDioException(e);
    } on FormatException {
      throw const UnknownFailure();
    }
  }

  @override
  Future<void> logout() => _tokenStorage.clear();

  @override
  Future<User?> getCurrentUser() async {
    final token = await _tokenStorage.readAccessToken();
    if (token == null) return null;
    try {
      final dto = await _remote.fetchCurrentUser();
      return dto.toDomain();
    } on DioException catch (e) {
      final failure = mapDioException(e);
      if (failure is UnauthorizedFailure) {
        await _tokenStorage.clear();
        return null;
      }
      throw failure;
    } on FormatException {
      throw const UnknownFailure();
    }
  }
}
