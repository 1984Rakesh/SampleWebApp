export interface DeleteTaskInput {
  id: string;
}

export async function deleteTaskUseCase(
  input: DeleteTaskInput
): Promise<void> {
  if (!input.id || input.id.length === 0) {
    throw new Error('Task ID is required');
  }

  // This would normally call the repository/API
  throw new Error('Repository not implemented');
}
