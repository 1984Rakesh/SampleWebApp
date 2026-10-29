import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'app/app.dart';
import 'app/providers.dart';

void main() {
  runApp(ProviderScope(overrides: appOverrides, child: const TasksApp()));
}
