import 'package:flutter/material.dart';

import '../view_state/task_item_view_state.dart';

/// A compact Material chip for a task's status.
class StatusChip extends StatelessWidget {
  const StatusChip({super.key, required this.label, required this.tone});

  final String label;
  final StatusTone tone;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final color = switch (tone) {
      StatusTone.todo => scheme.outline,
      StatusTone.inProgress => scheme.primary,
      StatusTone.completed => scheme.tertiary,
    };
    return Chip(
      label: Text(label),
      labelStyle: TextStyle(color: color, fontSize: 12),
      side: BorderSide(color: color.withValues(alpha: 0.4)),
      visualDensity: VisualDensity.compact,
    );
  }
}
