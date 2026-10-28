import 'package:tasks_mobile/core/use_case/use_case.dart';

import '../entities/user.dart';
import '../repositories/auth_repository.dart';

abstract interface class GetCurrentUserUseCase
    implements UseCase<User?, NoParams> {}

final class GetCurrentUserUseCaseImpl implements GetCurrentUserUseCase {
  GetCurrentUserUseCaseImpl(this._repository);

  final AuthRepository _repository;

  @override
  Future<User?> call(NoParams params) async {
    return _repository.getCurrentUser();
  }
}
