import { useState } from 'react';
import { useTaskUseCases, useUserUseCases } from '../../foundation/composition';
import type { Task, UpdateProfileInput } from '../../domain/models';
import { toTaskCounts } from '../models/taskPresentation';
import { toUserProfileViewState } from '../models/userPresentation';

const toErrorMessage = (error: unknown, fallback: string) => error instanceof Error ? error.message : fallback;

export function useUserViewModel() {
  const userUseCases = useUserUseCases();
  const taskUseCases = useTaskUseCases();
  const [nameDraft, setNameDraft] = useState<string>();
  const [bioDraft, setBioDraft] = useState<string>();
  const [updateErrorMessage, setUpdateErrorMessage] = useState<string>();
  const userQuery = userUseCases.useCurrentUserQuery();
  const taskQuery = taskUseCases.useTasksQuery({});
  const profile = userQuery.data ? toUserProfileViewState(userQuery.data) : undefined;
  const tasks = (taskQuery.data ?? []) as Task[];
  const taskCounts = toTaskCounts(tasks);
  const editName = nameDraft ?? profile?.name ?? '';
  const editBio = bioDraft ?? profile?.bio ?? '';

  const cancelEditing = () => {
    setNameDraft(undefined);
    setBioDraft(undefined);
    setUpdateErrorMessage(undefined);
  };
  const updateProfile = async (input: UpdateProfileInput): Promise<boolean> => {
    setUpdateErrorMessage(undefined);
    try { await userUseCases.updateProfile(input); return true; }
    catch (error) { setUpdateErrorMessage(toErrorMessage(error, 'Failed to update profile')); return false; }
  };
  const saveProfile = async () => {
    const saved = await updateProfile({ name: editName, bio: editBio });
    if (saved) cancelEditing();
    return saved;
  };

  return {
    profile,
    taskCounts: { created: tasks.length, completed: taskCounts.completed },
    isLoading: userQuery.isLoading || taskQuery.isLoading,
    errorMessage: userQuery.error ? toErrorMessage(userQuery.error, 'Failed to load profile') : undefined,
    isEditing: true,
    editName,
    editBio,
    setEditName: setNameDraft,
    setEditBio: setBioDraft,
    startEditing: cancelEditing,
    cancelEditing,
    saveProfile,
    updateProfile,
    isUpdating: userUseCases.isUpdating,
    updateErrorMessage,
  };
}
