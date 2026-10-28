import '../../domain/entities/user.dart';
import '../dtos/user_dto.dart';

/// Adds `toDomain()` to UserDto without changing the class itself.
extension UserDtoMapper on UserDto {
  User toDomain() => User(id: id, name: name, email: email);
}
