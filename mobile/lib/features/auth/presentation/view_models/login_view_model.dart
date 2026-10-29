import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:tasks_mobile/features/auth/domain/use_cases/login_use_case.dart';
import 'package:tasks_mobile/features/auth/presentation/providers/auth_use_case_providers.dart';
import 'package:tasks_mobile/core/failures/app_failure.dart';

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
      await login(LoginParams(email: state.email, password: state.password));
      if (!ref.mounted) return;
      state = state.copyWith(isSubmitting: false, isSignedIn: true);
    } on AppFailure catch (e) {
      if (!ref.mounted) return;
      state = state.copyWith(
        isSubmitting: false,
        errorMessage: e.message,
      ); // Handle error
    }
  }
}

final loginViewModelProvider = NotifierProvider<LoginViewModel, LoginViewState>(
  LoginViewModel.new,
);
