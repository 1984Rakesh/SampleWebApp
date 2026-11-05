import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/use_case/use_case.dart';
import '../../domain/entities/user.dart';
import '../providers/auth_use_case_providers.dart';

/// Who is signed in right now, or null; loading while the saved token
/// is checked.
class AuthSession extends AsyncNotifier<User?> {
  @override
  Future<User?> build() {
    final getCurrentUser = ref.read(getCurrentUserUseCaseProvider);
    return getCurrentUser(const NoParams());
  }

  void signedIn(User user) => state = AsyncData(user);

  Future<void> signOut() async {
    final logout = ref.read(logoutUseCaseProvider);
    await logout(const NoParams());
    state = const AsyncData(null);
  }
}

final authSessionProvider = AsyncNotifierProvider<AuthSession, User?>(
  AuthSession.new,
  // Riverpod 3 retries failed providers; a failed check should count as
  // signed out.
  retry: (retryCount, error) => null,
);
