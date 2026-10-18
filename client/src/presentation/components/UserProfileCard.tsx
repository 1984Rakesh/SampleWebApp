import { UiCard, UiCardContent, UiCardHeader, UiButton, UiAvatar, UiFlex, UiText } from './ui';
import type { UserProfileViewState } from '../models/UserProfileViewState';

interface UserProfileCardProps {
  profile: UserProfileViewState;
  onEdit?: () => void;
  isLoading?: boolean;
}

export default function UserProfileCard({ profile, onEdit, isLoading = false }: UserProfileCardProps) {
  return (
    <UiCard>
      <UiCardHeader
        title="Profile"
        action={
          onEdit ? (
            <UiButton variant="solid" onClick={onEdit} disabled={isLoading}>
              Edit
            </UiButton>
          ) : null
        }
      />
      <UiCardContent>
        <UiFlex align="start" gap={2}>
          {profile.avatarUrl && (
            <UiAvatar src={profile.avatarUrl} alt={profile.name} size="lg" />
          )}
          <UiFlex column grow>
            <UiText variant="h6" weight="semibold" gutterBottom>
              {profile.name}
            </UiText>
            <UiText tone="muted" variant="body2" gutterBottom>
              {profile.email}
            </UiText>
            {profile.bio && (
              <UiText variant="body2" mt={2}>
                {profile.bio}
              </UiText>
            )}
            {profile.joinedLabel && (
              <UiText tone="muted" variant="caption" mt={2}>
                Joined: {profile.joinedLabel}
              </UiText>
            )}
          </UiFlex>
        </UiFlex>
      </UiCardContent>
    </UiCard>
  );
}
