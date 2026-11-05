class LoginViewState {
  final String email;
  final String password;
  final bool isSubmitting;
  final String? errorMessage;

  const LoginViewState({
    this.email = '',
    this.password = '',
    this.isSubmitting = false,
    this.errorMessage,
  });

  bool get canSubmit =>
      !isSubmitting && email.trim().isNotEmpty && password.isNotEmpty;

  LoginViewState copyWith({
    String? email,
    String? password,
    bool? isSubmitting,
    String? errorMessage,
  }) {
    return LoginViewState(
      email: email ?? this.email,
      password: password ?? this.password,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      errorMessage: errorMessage,
    );
  }
}
