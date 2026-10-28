class UserDto {
  const UserDto({required this.id, required this.name, required this.email});

  factory UserDto.fromJson(Map<String, dynamic> json) {
    final id = json['id'];
    final name = json['name'];
    final email = json['email'];

    if (id is! String || name is! String || email is! String) {
      throw const FormatException('Unexpeected user JSON');
    }

    return UserDto(id: id, name: name, email: email);
  }

  final String id;
  final String name;
  final String email;
}
