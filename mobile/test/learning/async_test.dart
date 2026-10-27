import 'package:flutter_test/flutter_test.dart';
import 'package:tasks_mobile/core/failures/app_failure.dart';

Future<int> fetchCount() async {
  await Future.delayed(const Duration(milliseconds: 100));
  return 42;
}

Future<String> fetchName() async {
  await Future.delayed(const Duration(milliseconds: 100));
  return 'Demo User';
}

Future<int> fetchFailing() async {
  await Future.delayed(const Duration(milliseconds: 100));
  throw const NetworkFailure();
}

Stream<int> countdown(int from) async* {
  for (int i = from; i > 0; i--) {
    await Future.delayed(const Duration(milliseconds: 10));
    yield i;
  }
}

void main() {
  test('await waits for a Future', () async {
    final count = await fetchCount();
    expect(count, 42);
  });

  test('catch one specific failure type', () async {
    try {
      await fetchFailing();
      fail('fetchFailing should have thrown');
    } on NetworkFailure catch (e) {
      // ≈ Swift: catch let e as NetworkFailure
      expect(e.message, contains('server'));
    }
  });

  test('two calls at the same time with a record', () async {
    final stopwatch = Stopwatch()..start();
    // ≈ Swift: async let c = fetchCount(); async let n = fetchName()
    final (count, name) = await (fetchCount(), fetchName()).wait;
    expect(count, 42);
    expect(name, 'Demo User');
    // Both waited 100 ms in parallel, so the total is ~100 ms, not ~200 ms.
    expect(stopwatch.elapsedMilliseconds, lessThan(190));
  });

  test('Future.wait for a list of the same type', () async {
    final counts = await Future.wait([fetchCount(), fetchCount()]);
    expect(counts, [42, 42]);
  });

  test('read a Stream with await for', () async {
    final values = <int>[];
    await for (final value in countdown(3)) {
      // ≈ for await value in stream
      values.add(value);
    }
    expect(values, [3, 2, 1]);
  });
}
