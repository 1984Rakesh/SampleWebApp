import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

abstract interface class Clock {
  DateTime now();
}

class SystemClock implements Clock {
  @override
  DateTime now() => DateTime.now();
}

class FixedClock implements Clock {
  FixedClock(this._time);

  final DateTime _time;

  @override
  DateTime now() => _time;
}

class Greeter {
  Greeter(this._clock);

  final Clock _clock;

  String greet(String name) {
    final hour = _clock.now().hour;
    final part = hour < 12
        ? 'morning'
        : hour < 18
        ? 'afternoon'
        : 'evening';
    return 'Good $part, $name';
  }
}

// Each provider is a recipe for one object. Riverpod runs it on first use.
final clockProvider = Provider<Clock>((ref) => SystemClock());
final greeterProvider = Provider<Greeter>(
  (ref) => Greeter(ref.watch(clockProvider)),
);

void main() {
  group('by hand', () {
    test('morning', () {
      final greeter = Greeter(FixedClock(DateTime(2026, 1, 1, 9)));
      expect(greeter.greet('Rakesh'), 'Good morning, Rakesh');
    });

    test('evening', () {
      final greeter = Greeter(FixedClock(DateTime(2026, 1, 1, 20)));
      expect(greeter.greet('Rakesh'), 'Good evening, Rakesh');
    });
  });

  group('with Riverpod', () {
    test('override swaps the clock for the whole graph', () {
      final container = ProviderContainer.test(
        overrides: [
          clockProvider.overrideWithValue(FixedClock(DateTime(2026, 1, 1, 15))),
        ],
      );
      // We never built a Greeter ourselves: Riverpod did, with the fake clock.
      expect(
        container.read(greeterProvider).greet('Rakesh'),
        'Good afternoon, Rakesh',
      );
    });

    test('a provider builds its object once and caches it', () {
      final container = ProviderContainer.test();
      expect(
        identical(
          container.read(greeterProvider),
          container.read(greeterProvider),
        ),
        isTrue,
      );
    });
  });
}
