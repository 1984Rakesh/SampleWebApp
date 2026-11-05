/// A task exactly as the server sends it (GET/POST/PUT/PATCH /api/tasks).
class TaskDto {
  const TaskDto({
    required this.id,
    required this.title,
    required this.status,
    required this.priority,
    this.description,
    this.dueDate,
  });

  factory TaskDto.fromJson(Object? json) {
    if (json is! Map<String, dynamic>) {
      throw const FormatException('Expected a task object');
    }
    final id = json['id'];
    final title = json['title'];
    final status = json['status'];
    final priority = json['priority'];
    final description = json['description'];
    final dueDate = json['dueDate'];

    if (id is! String ||
        title is! String ||
        status is! String ||
        priority is! String ||
        description is! String? ||
        dueDate is! String?) {
      throw const FormatException('Unexpected task JSON');
    }

    return TaskDto(
      id: id,
      title: title,
      status: status,
      priority: priority,
      description: description,
      dueDate: dueDate,
    );
  }

  final String id;
  final String title;
  final String status;
  final String priority;
  final String? description;
  final String? dueDate;
}
