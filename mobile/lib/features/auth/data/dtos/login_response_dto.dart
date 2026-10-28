import 'package:tasks_mobile/features/auth/data/dtos/user_dto.dart';

class LoginResponseDto {
  const LoginResponseDto({
    required this.user,
    required this.accessToken,
    required this.refreshToken,
  });

  final UserDto user;
  final String accessToken;
  final String refreshToken;

  factory LoginResponseDto.fromJson(Map<String, dynamic> json) {
    final user = json['user'];
    final accessToken = json['accessToken'];
    final refreshToken = json['refreshToken'];
    if (user is! Map<String, dynamic> ||
        accessToken is! String ||
        refreshToken is! String) {
      throw const FormatException('Unexpected login JSON');
    }
    return LoginResponseDto(
      user: UserDto.fromJson(user),
      accessToken: accessToken,
      refreshToken: refreshToken,
    );
  }
}
