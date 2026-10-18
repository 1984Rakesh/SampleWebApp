import { useState } from 'react';
import { useUserUseCases } from '../../foundation/composition';
import type { UpdateProfileInput } from '../../domain/models';
import { toUserProfileViewState } from '../models/userPresentation';

const toErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function useUserViewModel() {
  const userUseCases = useUserUseCases();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [updateErrorMessage, setUpdateErrorMessage] = useState<string>();

  const userQuery = userUseCases.useCurrentUserQuery();
  const profile = userQuery.data ? toUserProfileViewState(userQuery.data) : undefined;

  const startEditing = () => {
    setEditName(profile?.name ?? '');
    setEditBio(profile?.bio ?? '');
    setUpdateErrorMessage(undefined);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setUpdateErrorMessage(undefined);
    setIsEditing(false);
  };

  const updateProfile = async (input: UpdateProfileInput): Promise<boolean> => {
    setUpdateErrorMessage(undefined);
    try {
      await userUseCases.updateProfile(input);
      return true;
    } catch (error) {
      setUpdateErrorMessage(toErrorMessage(error, 'Failed to update profile'));
      return false;
    }
  };

  const saveProfile = async (): Promise<boolean> => {
    const saved = await updateProfile({ name: editName, bio: editBio });
    if (saved) {
      setIsEditing(false);
    }
    return saved;
  };

  return {
    profile,
    isLoading: userQuery.isLoading,
    errorMessage: userQuery.error ? toErrorMessage(userQuery.error, 'Failed to load profile') : undefined,
    isEditing,
    editName,
    editBio,
    setEditName,
    setEditBio,
    startEditing,
    cancelEditing,
    saveProfile,
    updateProfile,
    isUpdating: userUseCases.isUpdating,
    updateErrorMessage,
  };
}
