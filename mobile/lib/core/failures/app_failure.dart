/// Every error the app can show, as one closed family.
/// `sealed` = the compiler knows all subclasses (they must live in this file),
/// so a `switch` over AppFailure must handle every case, like a Swift enum.
sealed class AppFailure implements Exception {
  const AppFailure(this.message);

  /// Text that is safe to show the user.
  final String message;
}

final class NetworkFailure extends AppFailure {
  const NetworkFailure()
    : super('Cannot reach the server. Check your connection.');
}

final class UnauthorizedFailure extends AppFailure {
  const UnauthorizedFailure()
    : super('Your session has ended. Please sign in again.');
}

final class NotFoundFailure extends AppFailure {
  const NotFoundFailure() : super('That item no longer exists.');
}

/// The server rejected the input; its own message is shown as-is.
final class ValidationFailure extends AppFailure {
  const ValidationFailure(super.message);
}

final class UnknownFailure extends AppFailure {
  const UnknownFailure() : super('Something went wrong. Please try again.');
}
