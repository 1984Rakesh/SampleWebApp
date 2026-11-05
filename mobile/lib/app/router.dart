import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../core/widgets/loading_view.dart';
import '../features/auth/domain/entities/user.dart';
import '../features/auth/presentation/session/auth_session.dart';
import '../features/auth/presentation/screens/login_screen.dart';
import '../features/tasks/presentation/screens/tasks_screen.dart';

abstract final class AppRoutes {
  static const splash = '/';
  static const login = "/login";
  static const tasks = "/tasks";
}

String? authRedirect({required bool? isSignedIn, required String location}) {
  if (isSignedIn == null) {
    return location == AppRoutes.splash ? null : AppRoutes.splash;
  }

  if (!isSignedIn) {
    return location == AppRoutes.login ? null : AppRoutes.login;
  }

  if (location == AppRoutes.login || location == AppRoutes.splash) {
    return AppRoutes.tasks;
  }

  return null;
}

bool? _isSignedIn(AsyncValue<User?> session) => switch (session) {
  AsyncData<User?>(:final value) => value != null,
  AsyncLoading() => null,
  AsyncError() => false,
};

final routerProvider = Provider<GoRouter>((ref) {
  final sessionChanged = ValueNotifier(0);
  ref.listen(authSessionProvider, (_, _) => sessionChanged.value++);

  final router = GoRouter(
    initialLocation: AppRoutes.splash,
    refreshListenable: sessionChanged,
    redirect: (context, state) => authRedirect(
      isSignedIn: _isSignedIn(ref.read(authSessionProvider)),
      location: state.matchedLocation,
    ),
    routes: [
      GoRoute(
        path: AppRoutes.splash,
        name: 'splash',
        builder: (context, state) => const LoadingView(),
      ),
      GoRoute(
        path: AppRoutes.login,
        name: 'login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: AppRoutes.tasks,
        name: 'tasks',
        builder: (context, state) => TasksScreen(
          onSignOut: () => ref.read(authSessionProvider.notifier).signOut(),
        ),
      ),
    ],
  );

  ref.onDispose(() {
    router.dispose();
    sessionChanged.dispose();
  });
  return router;
});
