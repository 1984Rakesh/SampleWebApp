import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/failures/app_failure.dart';
import '../../domain/use_cases/login_use_case.dart';
import '../providers/auth_use_case_providers.dart';
import '../session/auth_session.dart';
import '../view_state/login_view_state.dart';

class LoginViewModel extends Notifier<LoginViewState> {
  @override
  LoginViewState build() => const LoginViewState();

  void emailChanged(String value) {
    state = state.copyWith(email: value);
  }

  void passwordChanged(String value) {
    state = state.copyWith(password: value);
  }

  Future<void> submit() async {
    if (!state.canSubmit) return;
    state = state.copyWith(isSubmitting: true);

    final login = ref.read(loginUseCaseProvider);
    try {
      final user = await login(
        LoginParams(email: state.email, password: state.password),
      );
      if (!ref.mounted) return;
      state = state.copyWith(isSubmitting: false);
      ref.read(authSessionProvider.notifier).signedIn(user);
    } on AppFailure catch (e) {
      if (!ref.mounted) return;
      state = state.copyWith(
        isSubmitting: false,
        errorMessage: e.message,
      ); // Handle error
    }
  }
}

/// autoDispose so the form resets after sign-out.
final loginViewModelProvider =
    NotifierProvider.autoDispose<LoginViewModel, LoginViewState>(
      LoginViewModel.new,
    );
