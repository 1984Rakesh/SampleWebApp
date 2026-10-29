import 'package:dio/dio.dart';
import 'package:tasks_mobile/features/auth/data/dtos/login_response_dto.dart';
import 'package:tasks_mobile/features/auth/data/dtos/user_dto.dart';

class AuthRemoteDataSource {
  AuthRemoteDataSource(this._dio);

  final Dio _dio;

  Future<LoginResponseDto> login({
    required String email,
    required String password,
  }) async {
    final response = await _dio.post<Map<String, dynamic>>(
      '/auth/login',
      data: {'email': email, 'password': password},
    );
    return LoginResponseDto.fromJson(response.data!);
  }

  Future<UserDto> fetchCurrentUser() async {
    final response = await _dio.get<Map<String, dynamic>>('/users/me');
    return UserDto.fromJson(response.data ?? const {});
  }
}
