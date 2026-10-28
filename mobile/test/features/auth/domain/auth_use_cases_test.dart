import 'package:flutter_test/flutter_test.dart';
import 'package:tasks_mobile/core/failures/app_failure.dart';
import 'package:tasks_mobile/core/use_case/use_case.dart';
import 'package:tasks_mobile/features/auth/domain/entities/user.dart';
import 'package:tasks_mobile/features/auth/domain/repositories/auth_repository.dart';
import 'package:tasks_mobile/features/auth/domain/use_cases/login_use_case.dart';
import 'package:tasks_mobile/features/auth/domain/use_cases/get_current_user_use_case.dart';
import 'package:tasks_mobile/features/auth/domain/use_cases/logout_use_case.dart';

const demoUser = User(
  id: 'user-1',
  name: 'Demo User',
  email: 'demo@example.com',
);

class FakeAuthRepository implements AuthRepository {
  User? signedInUser;
  String? lastEmail;
  int logoutCalls = 0;

  @override
  Future<User> login({required String email, required String password}) {
    lastEmail = email;
    signedInUser = demoUser;
    return Future.value(demoUser);
  }

  @override
  Future<User?> getCurrentUser() {
    return Future.value(signedInUser);
  }

  @override
  Future<void> logout() {
    logoutCalls++;
    signedInUser = null;
    return Future.value();
  }
}

class FakeLoginUseCase implements LoginUseCase {
  LoginParams? lastParams;

  @override
  Future<User> call(LoginParams params) {
    lastParams = params;
    return Future.value(demoUser);
  }
}

void main() {
  late FakeAuthRepository repository;

  // Runs before every test, so each one starts with a fresh fake.
  setUp(() => repository = FakeAuthRepository());

  group('LoginUseCaseImpl', () {
    test('trims the email and returns the user', () async {
      final LoginUseCase login = LoginUseCaseImpl(repository);

      final user = await login(
        const LoginParams(email: '  demo@example.com ', password: 'pw'),
      );

      expect(user, demoUser);
      expect(repository.lastEmail, 'demo@example.com');
    });

    test('rejects an empty email without calling the server', () async {
      final LoginUseCase login = LoginUseCaseImpl(repository);

      await expectLater(
        login(const LoginParams(email: '   ', password: 'pw')),
        throwsA(isA<ValidationFailure>()),
      );
      expect(repository.lastEmail, isNull);
    });

    test('rejects an empty password', () async {
      final LoginUseCase login = LoginUseCaseImpl(repository);

      await expectLater(
        login(const LoginParams(email: 'demo@example.com', password: '')),
        throwsA(isA<ValidationFailure>()),
      );
    });
  });

  test('GetCurrentUserUseCaseImpl returns null when signed out', () async {
    final GetCurrentUserUseCase getCurrentUser = GetCurrentUserUseCaseImpl(
      repository,
    );

    expect(await getCurrentUser(const NoParams()), isNull);
  });

  test('LogoutUseCaseImpl signs the user out', () async {
    repository.signedInUser = demoUser;
    final LogoutUseCase logout = LogoutUseCaseImpl(repository);

    await logout(const NoParams());

    expect(repository.logoutCalls, 1);
    expect(repository.signedInUser, isNull);
  });

  test('anything typed LoginUseCase can be swapped for a fake', () async {
    final fake = FakeLoginUseCase();
    final LoginUseCase login = fake;

    await login(const LoginParams(email: 'a@b.c', password: 'pw'));

    expect(fake.lastParams?.email, 'a@b.c');
  });

  test('two users with the same values are equal', () {
    const copy = User(
      id: 'user-1',
      name: 'Demo User',
      email: 'demo@example.com',
    );
    expect(copy, demoUser);
    expect(copy.hashCode, demoUser.hashCode);
  });
}
