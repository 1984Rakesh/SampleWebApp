import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tasks_mobile/core/widgets/loading_button.dart';

Widget host(Widget child) => MaterialApp(home: Scaffold(body: child));

void main() {
  testWidgets('shows the label and calls onPressed when tapped', (
    WidgetTester tester,
  ) async {
    var taps = 0;
    await tester.pumpWidget(
      host(
        LoadingButton(label: 'Go', isLoading: false, onPressed: () => taps++),
      ),
    );

    await tester.tap(find.text('Go'));
    expect(taps, 1);
  });

  testWidgets('shows a spinner and ignores taps while loading', (tester) async {
    var taps = 0;
    await tester.pumpWidget(
      host(
        LoadingButton(label: 'Go', isLoading: true, onPressed: () => taps++),
      ),
    );

    expect(find.byType(CircularProgressIndicator), findsOneWidget);
    expect(find.text('Go'), findsNothing);
    await tester.tap(find.byType(FilledButton));
    expect(taps, 0);
  });
}
