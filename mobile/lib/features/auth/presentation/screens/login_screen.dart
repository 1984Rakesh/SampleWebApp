import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/widgets/app_text_field.dart';
import '../../../../core/widgets/loading_button.dart';
import '../view_models/login_view_model.dart';

class LoginScreen extends ConsumerWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(loginViewModelProvider);
    final viewModel = ref.read(loginViewModelProvider.notifier);
    final theme = Theme.of(context);

    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 400),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text('Welcome back', style: theme.textTheme.headlineMedium),
                const SizedBox(height: 24),
                AppTextField(
                  label: 'Email',
                  keyboardType: TextInputType.emailAddress,
                  onChanged: viewModel.emailChanged,
                ),
                const SizedBox(height: 12),
                AppTextField(
                  label: 'Password',
                  obscureText: true,
                  onChanged: viewModel.passwordChanged,
                ),
                if (state.errorMessage case final message?) ...[
                  const SizedBox(height: 12),
                  Text(
                    message,
                    style: TextStyle(color: theme.colorScheme.error),
                  ),
                ],
                const SizedBox(height: 24),
                if (state.isSignedIn)
                  const Text('Signed in ✓', textAlign: TextAlign.center)
                else
                  LoadingButton(
                    label: 'Sign in',
                    isLoading: state.isSubmitting,
                    onPressed: state.canSubmit
                        ? () => viewModel.submit()
                        : null,
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
