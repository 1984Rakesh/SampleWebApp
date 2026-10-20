import axiosClient from '../../foundation/network/axiosClient';
import { createProfileApi } from '../../profile/data/api/ProfileApi';
import { createProfileRepository } from '../../profile/data/repositories/HttpProfileRepository';
import { useProfileRepository } from '../../profile/data/repositories/ReactQueryProfileRepository';
import { updateProfileUseCase } from '../../profile/domain/useCases/UpdateProfileUseCase';
import type { UpdateProfileInput } from '../../profile/domain/models/Profile';
import { useAuth } from '../../security/presentation/context/AuthSessionContext';
import { toTaskCounts } from '../../tasks/presentation/models/taskPresentation';
import { sessions } from './securityRuntime';
import { bindProfileSession } from './profileSession';
import { useTaskUseCases } from './useTaskUseCases';

const source = bindProfileSession(createProfileRepository(createProfileApi(axiosClient)), sessions);

function useTaskCounts() {
  const query = useTaskUseCases().useTasksQuery({});
  const tasks = query.data ?? [];
  return { created: tasks.length, completed: toTaskCounts(tasks).completed, isLoading: query.isLoading };
}

export function useUserUseCases() {
  const { user } = useAuth();
  const { repository, useCurrentUserQuery, isUpdating } = useProfileRepository(source, user?.id);
  return {
    useCurrentUserQuery, useTaskCounts,
    updateProfile: (input: UpdateProfileInput) => updateProfileUseCase(repository, input),
    isUpdating,
  };
}
