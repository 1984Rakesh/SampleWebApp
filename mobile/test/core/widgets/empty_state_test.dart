import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tasks_mobile/core/widgets/empty_state.dart';

Widget host(Widget child) => MaterialApp(home: Scaffold(body: child));

void main() {
  testWidgets('shows the message and calls back when the action is tapped', (
    tester,
  ) async {
    var taps = 0;
    await tester.pumpWidget(
      host(
        EmptyState(
          message: 'Nothing here',
          actionLabel: 'Try again',
          onAction: () => taps++,
        ),
      ),
    );

    expect(find.text('Nothing here'), findsOneWidget);

    await tester.tap(find.text('Try again'));
    expect(taps, 1);
  });
}
