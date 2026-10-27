import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tasks_mobile/core/failures/app_failure.dart';
import 'package:tasks_mobile/core/network/api_client.dart';
import 'package:tasks_mobile/core/storage/token_storage.dart';

/// A fake that keeps tokens in memory. It works anywhere a TokenStorage
/// is expected, which is the whole point of the contract.
class FakeTokenStorage implements TokenStorage {
  FakeTokenStorage([this.accessToken]);

  String? accessToken;

  @override
  Future<String?> readAccessToken() async => accessToken;

  @override
  Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    this.accessToken = accessToken;
  }

  @override
  Future<void> clear() async => accessToken = null;
}

/// Sends one GET through [dio] without a network: the last interceptor
/// records the outgoing request and answers it itself.
Future<RequestOptions> captureRequest(Dio dio) async {
  late RequestOptions captured;
  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) {
        captured = options;
        handler.resolve(Response(requestOptions: options, statusCode: 200));
      },
    ),
  );
  await dio.get<void>('/tasks');
  return captured;
}

DioException errorWith(int statusCode, [Object? data]) {
  final options = RequestOptions(path: '/tasks');
  return DioException(
    requestOptions: options,
    response: Response(
      requestOptions: options,
      statusCode: statusCode,
      data: data,
    ),
  );
}

void main() {
  group('AuthInterceptor', () {
    test('adds the bearer token when signed in', () async {
      final dio = createDio(tokenStorage: FakeTokenStorage('abc123'));
      final request = await captureRequest(dio);
      expect(request.headers['Authorization'], 'Bearer abc123');
    });

    test('adds no header when signed out', () async {
      final dio = createDio(tokenStorage: FakeTokenStorage());
      final request = await captureRequest(dio);
      expect(request.headers.containsKey('Authorization'), isFalse);
    });
  });

  test('uses the emulator address by default (tests do not run on web)', () {
    expect(defaultApiBaseUrl(), 'http://10.0.2.2:3001/api');
  });

  group('mapDioException', () {
    test('no response means the server was unreachable', () {
      final error = DioException(
        requestOptions: RequestOptions(path: '/tasks'),
        type: DioExceptionType.connectionError,
      );
      expect(mapDioException(error), isA<NetworkFailure>());
    });

    test('401 means signed out', () {
      expect(mapDioException(errorWith(401)), isA<UnauthorizedFailure>());
    });

    test('404 means not found', () {
      expect(mapDioException(errorWith(404)), isA<NotFoundFailure>());
    });

    test('400 keeps the server message', () {
      final failure = mapDioException(
        errorWith(400, {'error': 'Title is required'}),
      );
      expect(failure, isA<ValidationFailure>());
      expect(failure.message, 'Title is required');
    });

    test('500 is unknown', () {
      expect(mapDioException(errorWith(500)), isA<UnknownFailure>());
    });
  });
}
