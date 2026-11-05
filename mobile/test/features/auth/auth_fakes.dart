import 'package:tasks_mobile/core/failures/app_failure.dart';
import 'package:tasks_mobile/core/use_case/use_case.dart';
import 'package:tasks_mobile/features/auth/domain/entities/user.dart';
import 'package:tasks_mobile/features/auth/domain/use_cases/get_current_user_use_case.dart';
import 'package:tasks_mobile/features/auth/domain/use_cases/login_use_case.dart';
import 'package:tasks_mobile/features/auth/domain/use_cases/logout_use_case.dart';

const demoUser = User(id: 'user-1', name: 'Demo', email: 'demo@example.com');

class FakeLoginUseCase implements LoginUseCase {
  AppFailure? failWith;
  LoginParams? lastParams;

  @override
  Future<User> call(LoginParams params) {
    lastParams = params;
    if (failWith case final failure?) throw failure;
    return Future.value(demoUser);
  }
}

class FakeGetCurrentUserUseCase implements GetCurrentUserUseCase {
  FakeGetCurrentUserUseCase([this.user]);

  final User? user;
  AppFailure? failWith;

  @override
  Future<User?> call(NoParams params) {
    if (failWith case final failure?) throw failure;
    return Future.value(user);
  }
}

class FakeLogoutUseCase implements LogoutUseCase {
  int calls = 0;

  @override
  Future<void> call(NoParams params) async {
    calls++;
  }
}
