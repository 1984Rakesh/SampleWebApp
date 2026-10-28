import 'package:tasks_mobile/core/use_case/use_case.dart';

import '../repositories/auth_repository.dart';

abstract interface class LogoutUseCase implements UseCase<void, NoParams> {}

final class LogoutUseCaseImpl implements LogoutUseCase {
  LogoutUseCaseImpl(this._repository);

  final AuthRepository _repository;

  @override
  Future<void> call(NoParams params) async {
    return _repository.logout();
  }
}
