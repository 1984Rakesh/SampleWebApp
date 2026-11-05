import 'package:flutter/material.dart';

import '../view_state/task_item_view_state.dart';

/// A small coloured pill for a task's priority.
class PriorityBadge extends StatelessWidget {
  const PriorityBadge({super.key, required this.label, required this.tone});

  final String label;
  final PriorityTone tone;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final color = switch (tone) {
      PriorityTone.low => scheme.secondary,
      PriorityTone.medium => scheme.tertiary,
      PriorityTone.high => scheme.error,
    };
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
