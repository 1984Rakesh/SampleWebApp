import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../domain/use_cases/get_current_user_use_case.dart';
import '../../domain/use_cases/login_use_case.dart';
import '../../domain/use_cases/logout_use_case.dart';

// What the auth screens need, declared by the feature itself.
// The feature doesn't know the real classes: `app/` overrides these
// (see appOverrides), and tests override them with fakes.

final loginUseCaseProvider = Provider<LoginUseCase>(
  (ref) => throw UnimplementedError('app/ must override loginUseCaseProvider'),
);

final getCurrentUserUseCaseProvider = Provider<GetCurrentUserUseCase>(
  (ref) => throw UnimplementedError(
    'app/ must override getCurrentUserUseCaseProvider',
  ),
);

final logoutUseCaseProvider = Provider<LogoutUseCase>(
  (ref) => throw UnimplementedError('app/ must override logoutUseCaseProvider'),
);
