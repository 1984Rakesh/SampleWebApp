import { useState } from 'react';
import { useUserUseCases } from '../context';
import type { UpdateProfileInput } from '../../domain/models/Profile';
import { toUserProfileViewState } from '../models/userPresentation';

const toErrorMessage = (error: unknown, fallback: string) => error instanceof Error ? error.message : fallback;

export function useUserViewModel() {
  const userUseCases = useUserUseCases();
  const [nameDraft, setNameDraft] = useState<string>();
  const [bioDraft, setBioDraft] = useState<string>();
  const [updateErrorMessage, setUpdateErrorMessage] = useState<string>();
  const userQuery = userUseCases.useCurrentUserQuery();
  const taskCounts = userUseCases.useTaskCounts();
  const profile = userQuery.data ? toUserProfileViewState(userQuery.data) : undefined;
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
    taskCounts: { created: taskCounts.created, completed: taskCounts.completed },
    statusLabels: userUseCases.statusLabels,
    isLoading: userQuery.isLoading || taskCounts.isLoading,
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
