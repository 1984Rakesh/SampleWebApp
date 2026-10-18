import { useState } from 'react';
import { useUserUseCases } from '../../foundation/composition';
import type { UpdateProfileInput } from '../../domain/useCases';
import { toUserProfileViewState } from '../models/userPresentation';

const toErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function useUserViewModel() {
  const userUseCases = useUserUseCases();
  const [updateErrorMessage, setUpdateErrorMessage] = useState<string>();

  const userQuery = userUseCases.useCurrentUserQuery();

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

  return {
    profile: userQuery.data ? toUserProfileViewState(userQuery.data) : undefined,
    isLoading: userQuery.isLoading,
    errorMessage: userQuery.error ? toErrorMessage(userQuery.error, 'Failed to load profile') : undefined,
    updateProfile,
    isUpdating: userUseCases.isUpdating,
    updateErrorMessage,
  };
}
