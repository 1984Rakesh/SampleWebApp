/// Tri-state update for a nullable field: keep the stored value, clear it
/// back to null, or set a new one. `sealed` so a `switch` covers every case.
sealed class Patch<T> {
  const Patch();
}

/// Leave the stored value untouched.
final class Keep<T> extends Patch<T> {
  const Keep();
}

/// Clear the stored value back to null.
final class Clear<T> extends Patch<T> {
  const Clear();
}

/// Replace the stored value.
final class SetTo<T> extends Patch<T> {
  const SetTo(this.value);

  final T value;
}
