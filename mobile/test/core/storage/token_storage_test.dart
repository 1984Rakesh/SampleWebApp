import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tasks_mobile/core/storage/token_storage.dart';

void main() {
  // Tests run on your Mac, not a phone, so there is no real Keystore.
  // This swaps the plugin for an in-memory map.
  setUp(() => FlutterSecureStorage.setMockInitialValues({}));

  test('saves, reads and clears the access token', () async {
    final storage = SecureTokenStorage(const FlutterSecureStorage());

    expect(await storage.readAccessToken(), isNull);

    await storage.saveTokens(accessToken: 'abc', refreshToken: 'def');
    expect(await storage.readAccessToken(), 'abc');

    await storage.clear();
    expect(await storage.readAccessToken(), isNull);
  });
}
