import { UiAvatar, UiCard, UiCardContent, UiChip, UiFlex, UiText } from './ui';
import type { UserProfileViewState } from '../models/UserProfileViewState';

interface UserProfileCardProps { profile: UserProfileViewState; created: number; completed: number }

export default function UserProfileCard({ profile, created, completed }: UserProfileCardProps) {
  return (
    <UiCard>
      <UiCardContent>
        <UiFlex column align="center" textAlign="center" gap={1.5}>
          <UiAvatar src={profile.avatarUrl} alt={profile.name} label={profile.initial} size="lg" tone="primary" variant="solid" />
          <UiText variant="h5" as="h2" weight="bold">{profile.name}</UiText>
          <UiText tone="muted" variant="body2">{profile.email}</UiText>
          {profile.joinedLabel && <UiChip label={`Joined ${profile.joinedLabel}`} tone="neutral" />}
        </UiFlex>
        <UiFlex dividerTop justify="space-between" textAlign="center">
          <UiFlex column flex={1}><UiText variant="h5" weight="bold">{created}</UiText><UiText variant="body2" tone="muted">Created</UiText></UiFlex>
          <UiFlex column flex={1}><UiText variant="h5" weight="bold">{completed}</UiText><UiText variant="body2" tone="muted">Completed</UiText></UiFlex>
        </UiFlex>
      </UiCardContent>
    </UiCard>
  );
}
