import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

import '../failures/app_failure.dart';
import '../storage/token_storage.dart';

const _baseUrlOverride = String.fromEnvironment('API_BASE_URL');

String defaultApiBaseUrl() {
  if (_baseUrlOverride.isNotEmpty) {
    return _baseUrlOverride;
  }
  return kIsWeb ? 'http://localhost:3001/api' : 'http://10.0.2.2:3001/api';
}

Dio createDio({required TokenStorage tokenStorage, String? baseUrl}) {
  final dio = Dio(
    BaseOptions(
      baseUrl: baseUrl ?? defaultApiBaseUrl(),
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
    ),
  );

  // Add interceptors for auth and error handling
  dio.interceptors.add(AuthInterceptor(tokenStorage));
  return dio;
}

class AuthInterceptor extends Interceptor {
  AuthInterceptor(this._tokenStorage);

  final TokenStorage _tokenStorage;

  @override
  void onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    // Add auth token to request headers
    final token = await _tokenStorage.readAccessToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }
}

AppFailure mapDioException(DioException exception) {
  final response = exception.response;
  if (response == null) return const NetworkFailure();
  return switch (response.statusCode) {
    400 || 409 => ValidationFailure(
      _serverMessage(response.data) ?? 'Please check your input.',
    ),
    401 => const UnauthorizedFailure(),
    404 => const NotFoundFailure(),
    _ => const UnknownFailure(),
  };
}

String? _serverMessage(Object? data) {
  if (data is Map && data['error'] is String) return data['error'] as String;
  return null;
}
