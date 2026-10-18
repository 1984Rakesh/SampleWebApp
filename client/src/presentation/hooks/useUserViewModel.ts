import { useState } from 'react';
import { useUserRepository } from '../../data/repositories';
import { updateProfileUseCase } from '../../domain/useCases';
import type { UpdateProfileInput } from '../../domain/useCases';
import { toUserProfileViewState } from '../models/userPresentation';

const toErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function useUserViewModel() {
  const { repository, useCurrentUserQuery, isUpdating } = useUserRepository();
  const [updateErrorMessage, setUpdateErrorMessage] = useState<string>();

  const userQuery = useCurrentUserQuery();

  const updateProfile = async (input: UpdateProfileInput): Promise<boolean> => {
    setUpdateErrorMessage(undefined);
    try {
      await updateProfileUseCase(repository, input);
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
    isUpdating,
    updateErrorMessage,
  };
}
