import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { UiCard, UiCardContent, UiCardHeader } from './ui';
import { UiButton } from './ui';
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
            <UiButton variant="contained" onClick={onEdit} disabled={isLoading}>
              Edit
            </UiButton>
          ) : null
        }
      />
      <UiCardContent>
        <Box display="flex" alignItems="flex-start" gap={2}>
          {profile.avatarUrl && (
            <Avatar src={profile.avatarUrl} alt={profile.name} sx={{ width: 80, height: 80 }} />
          )}
          <Box flex={1}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {profile.name}
            </Typography>
            <Typography color="text.secondary" variant="body2" gutterBottom>
              {profile.email}
            </Typography>
            {profile.bio && (
              <Typography color="text.primary" variant="body2" sx={{ mt: 2 }}>
                {profile.bio}
              </Typography>
            )}
            {profile.joinedLabel && (
              <Typography color="text.secondary" variant="caption" sx={{ mt: 2, display: 'block' }}>
                Joined: {profile.joinedLabel}
              </Typography>
            )}
          </Box>
        </Box>
      </UiCardContent>
    </UiCard>
  );
}
