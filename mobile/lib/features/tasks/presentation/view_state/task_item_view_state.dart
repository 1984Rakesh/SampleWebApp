/// How a status should look, so widgets never touch domain enums.
enum StatusTone { todo, inProgress, completed }

/// How a priority should look, so widgets never touch domain enums.
enum PriorityTone { low, medium, high }

/// One task row as the UI sees it: strings and tones only.
class TaskItemViewState {
  const TaskItemViewState({
    required this.id,
    required this.title,
    this.description,
    required this.statusLabel,
    required this.statusTone,
    required this.priorityLabel,
    required this.priorityTone,
    this.dueLabel,
    required this.isOverdue,
    required this.isCompleted,
  });

  final String id;
  final String title;
  final String? description;
  final String statusLabel;
  final StatusTone statusTone;
  final String priorityLabel;
  final PriorityTone priorityTone;
  final String? dueLabel;
  final bool isOverdue;
  final bool isCompleted;
}
