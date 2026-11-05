import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/widgets/empty_state.dart';
import '../view_models/task_list_view_model.dart';
import '../view_state/task_list_view_state.dart';
import '../widgets/task_tile.dart';

class TasksScreen extends ConsumerWidget {
  const TasksScreen({super.key, required this.onSignOut});

  final VoidCallback onSignOut;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(taskListViewModelProvider);
    final viewModel = ref.read(taskListViewModelProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Tasks'),
        actions: [
          IconButton(
            onPressed: onSignOut,
            icon: const Icon(Icons.logout),
            tooltip: 'Sign out',
          ),
        ],
      ),
      body: switch (state) {
        TaskListLoading() => const Center(child: CircularProgressIndicator()),
        TaskListEmpty() => const EmptyState(message: 'No tasks yet'),
        TaskListError(:final message) => EmptyState(
          message: message,
          actionLabel: 'Try again',
          onAction: viewModel.retry,
        ),
        TaskListLoaded(:final items) => RefreshIndicator(
          onRefresh: viewModel.refresh,
          child: ListView.builder(
            itemCount: items.length,
            itemBuilder: (context, index) => TaskTile(item: items[index]),
          ),
        ),
      },
    );
  }
}
