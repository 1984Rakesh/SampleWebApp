import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../core/network/api_client.dart';
import '../core/storage/token_storage.dart';

final tokenStorageProvider = Provider<TokenStorage>(
  (ref) => SecureTokenStorage(const FlutterSecureStorage()),
);

final dioProvider = Provider<Dio>((ref) {
  final dio = createDio(tokenStorage: ref.watch(tokenStorageProvider));
  ref.onDispose(dio.close);
  return dio;
});
