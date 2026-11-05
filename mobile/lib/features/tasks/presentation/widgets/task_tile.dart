import 'package:flutter/material.dart';

import '../view_state/task_item_view_state.dart';
import 'priority_badge.dart';
import 'status_chip.dart';

/// One row of the task list: checkbox, title, then status/priority/due.
class TaskTile extends StatelessWidget {
  const TaskTile({super.key, required this.item, this.onToggle, this.onTap});

  final TaskItemViewState item;
  final ValueChanged<bool>? onToggle;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return ListTile(
      leading: Checkbox(
        value: item.isCompleted,
        onChanged: onToggle == null
            ? null
            : (checked) => onToggle!(checked ?? false),
      ),
      title: Text(
        item.title,
        style: item.isCompleted
            ? const TextStyle(decoration: TextDecoration.lineThrough)
            : null,
      ),
      subtitle: Wrap(
        spacing: 8,
        crossAxisAlignment: WrapCrossAlignment.center,
        children: [
          StatusChip(label: item.statusLabel, tone: item.statusTone),
          PriorityBadge(label: item.priorityLabel, tone: item.priorityTone),
          if (item.dueLabel case final due?)
            Text(
              due,
              style: TextStyle(
                color: item.isOverdue ? theme.colorScheme.error : null,
              ),
            ),
        ],
      ),
      onTap: onTap,
    );
  }
}
