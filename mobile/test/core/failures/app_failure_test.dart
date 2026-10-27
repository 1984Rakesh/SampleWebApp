import 'package:flutter_test/flutter_test.dart';
import 'package:tasks_mobile/core/failures/app_failure.dart';

String titleFor(AppFailure failure) => switch (failure) {
  NetworkFailure() => 'Offline',
  UnauthorizedFailure() => 'Signed out',
  NotFoundFailure() => 'Not found',
  ValidationFailure() => 'Check your input',
  UnknownFailure() => 'Error',
};

void main() {
  group('AppFailure', () {
    test('NetworkFailure has correct message', () {
      const failure = NetworkFailure();
      expect(
        failure.message,
        'Cannot reach the server. Check your connection.',
      );
    });

    test('UnauthorizedFailure has correct message', () {
      const failure = UnauthorizedFailure();
      expect(failure.message, 'Your session has ended. Please sign in again.');
    });

    test('NotFoundFailure has correct message', () {
      const failure = NotFoundFailure();
      expect(failure.message, 'That item no longer exists.');
    });

    test('ValidationFailure uses provided message', () {
      const failure = ValidationFailure('Invalid email format');
      expect(failure.message, 'Invalid email format');
    });

    test('UnknownFailure has correct message', () {
      const failure = UnknownFailure();
      expect(failure.message, 'Something went wrong. Please try again.');
    });
  });

  test('each failure has a title', () {
    expect(titleFor(const NetworkFailure()), 'Offline');
    expect(titleFor(const UnauthorizedFailure()), 'Signed out');
    expect(titleFor(const ValidationFailure('x')), 'Check your input');
  });

  test('validation failure keeps the server message', () {
    const failure = ValidationFailure('Title is required');
    expect(failure.message, 'Title is required');
  });

  test('const failures are the same object', () {
    // `const` objects with the same values are created once and shared.
    expect(identical(const NetworkFailure(), const NetworkFailure()), isTrue);
  });
}
