import '../../../../core/failures/app_failure.dart';

import '../entities/patch.dart';

/// Input rules shared by the task use cases, so each one stays small and
/// the rules live in exactly one place.
abstract final class TaskRules {
  /// A title is required; surrounding whitespace does not count.
  static String title(String raw) {
    final trimmed = raw.trim();
    if (trimmed.isEmpty) {
      throw const ValidationFailure('Title is required');
    }
    return trimmed;
  }

  /// Every operation on an existing task needs a non-blank id.
  static void requireId(String id) {
    if (id.trim().isEmpty) {
      throw const ValidationFailure('Task ID is required');
    }
  }

  /// Optional free text: blank becomes null, otherwise trimmed.
  static String? optionalText(String? raw) {
    final trimmed = raw?.trim();
    return trimmed == null || trimmed.isEmpty ? null : trimmed;
  }

  /// Normalize a text patch: writing blank text clears the field.
  static Patch<String> textPatch(Patch<String> patch) => switch (patch) {
    SetTo<String>(value: final text) when text.trim().isEmpty => const Clear(),
    SetTo<String>(value: final text) => SetTo(text.trim()),
    _ => patch,
  };
}
