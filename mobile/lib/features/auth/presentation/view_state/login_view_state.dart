class LoginViewState {
  final String email;
  final String password;
  final bool isSubmitting;
  final bool isSignedIn;
  final String? errorMessage;

  const LoginViewState({
    this.email = '',
    this.password = '',
    this.isSubmitting = false,
    this.isSignedIn = false,
    this.errorMessage,
  });

  bool get canSubmit =>
      email.trim().isNotEmpty && password.trim().isNotEmpty && !isSubmitting;

  LoginViewState copyWith({
    String? email,
    String? password,
    bool? isSubmitting,
    bool? isSignedIn,
    String? errorMessage,
  }) {
    return LoginViewState(
      email: email ?? this.email,
      password: password ?? this.password,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      isSignedIn: isSignedIn ?? this.isSignedIn,
      errorMessage: errorMessage,
    );
  }
}
