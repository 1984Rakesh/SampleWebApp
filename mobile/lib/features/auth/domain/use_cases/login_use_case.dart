import 'package:tasks_mobile/core/failures/app_failure.dart';
import 'package:tasks_mobile/core/use_case/use_case.dart';

import '../repositories/auth_repository.dart';
import '../entities/user.dart';

final class LoginParams {
  const LoginParams({required this.email, required this.password});

  final String email;
  final String password;
}

abstract interface class LoginUseCase implements UseCase<User, LoginParams> {}

class LoginUseCaseImpl implements LoginUseCase {
  LoginUseCaseImpl(this._repository);

  final AuthRepository _repository;

  @override
  Future<User> call(LoginParams params) async {
    final email = params.email.trim();
    if (email.isEmpty || params.password.isEmpty) {
      throw const ValidationFailure('Email and password are required');
    }
    return _repository.login(email: email, password: params.password);
  }
}
