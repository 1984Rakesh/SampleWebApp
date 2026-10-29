import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tasks_mobile/core/failures/app_failure.dart';
import 'package:tasks_mobile/features/auth/data/repositories/auth_repository_impl.dart';
import 'package:tasks_mobile/features/auth/data/datasources/auth_remote_data_source.dart';
import 'package:tasks_mobile/features/auth/domain/entities/user.dart';

import '../../../core/network/api_client_test.dart';

const userJson = {
  'id': 'user-1',
  'name': 'Demo User',
  'email': 'demo@example.com',
  'avatar': null,
  'bio': null,
  'createdAt': '2026-01-01T00:00:00.000Z',
};

const demoUser = User(
  id: 'user-1',
  name: 'Demo User',
  email: 'demo@example.com',
);

class FakeServer {
  final requests = <RequestOptions>[];
  (int, Object?) Function(RequestOptions request) answer = (_) => (200, null);
  Dio get dio {
    final dio = Dio(BaseOptions(baseUrl: 'http://test/api'));
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          requests.add(options);
          final (status, body) = answer(options);
          final response = Response<Object?>(
            requestOptions: options,
            statusCode: status,
            data: body,
          );
          if (status >= 400) {
            handler.reject(
              DioException(response: response, requestOptions: options),
            );
          } else {
            handler.resolve(response);
          }
        },
      ),
    );
    return dio;
  }
}

void main() {
  late FakeServer server;
  late FakeTokenStorage tokens;
  late AuthRepositoryImpl repository;

  setUp(() {
    server = FakeServer();
    tokens = FakeTokenStorage();
    repository = AuthRepositoryImpl(AuthRemoteDataSource(server.dio), tokens);
  });

  group('login', () {
    test('posts the credentials, saves the token, returns the user', () async {
      server.answer = (_) => (
        200,
        {'user': userJson, 'accessToken': 'abc', 'refreshToken': 'xyz'},
      );

      final user = await repository.login(
        email: 'demo@example.com',
        password: 'password123',
      );

      expect(user, demoUser);
      expect(tokens.accessToken, 'abc');
      expect(server.requests.single.method, 'POST');
      expect(server.requests.single.path, '/auth/login');
      expect(server.requests.single.data, {
        'email': 'demo@example.com',
        'password': 'password123',
      });
    });

    test('401 means wrong email or password', () async {
      server.answer = (_) => (401, {'error': 'Invalid credentials'});

      await expectLater(
        repository.login(email: 'demo@example.com', password: 'nope'),
        throwsA(
          isA<ValidationFailure>().having(
            (f) => f.message,
            'message',
            'Wrong email or password.',
          ),
        ),
      );
      expect(tokens.accessToken, isNull);
    });

    test('a body with the wrong shape becomes UnknownFailure', () async {
      server.answer = (_) => (200, {'accessToken': 'abc'});

      await expectLater(
        repository.login(email: 'demo@example.com', password: 'pw'),
        throwsA(isA<UnknownFailure>()),
      );
    });
  });

  group('getCurrentUser', () {
    test('returns null without asking the server when no token', () async {
      expect(await repository.getCurrentUser(), isNull);
      expect(server.requests, isEmpty);
    });

    test('returns the user from GET /users/me', () async {
      tokens.accessToken = 'abc';
      server.answer = (_) => (200, userJson);

      expect(await repository.getCurrentUser(), demoUser);
      expect(server.requests.single.path, '/users/me');
    });

    test('a rejected token is cleared and counts as signed out', () async {
      tokens.accessToken = 'expired';
      server.answer = (_) => (401, {'error': 'Invalid token'});

      expect(await repository.getCurrentUser(), isNull);
      expect(tokens.accessToken, isNull);
    });

    test('other server errors are passed on as AppFailures', () async {
      tokens.accessToken = 'abc';
      server.answer = (_) => (500, null);

      await expectLater(
        repository.getCurrentUser(),
        throwsA(isA<UnknownFailure>()),
      );
      expect(tokens.accessToken, 'abc');
    });
  });

  test('an empty body becomes UnknownFailure, not a crash', () async {
    tokens.accessToken = 'abc';
    server.answer = (_) => (200, null);

    await expectLater(
      repository.getCurrentUser(),
      throwsA(isA<UnknownFailure>()),
    );
  });

  test('logout forgets the tokens without calling the server', () async {
    tokens.accessToken = 'abc';

    await repository.logout();

    expect(tokens.accessToken, isNull);
    expect(server.requests, isEmpty);
  });
}
