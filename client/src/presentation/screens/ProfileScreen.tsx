import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useUserViewModel } from '../hooks';
import UserProfileCard from '../components/UserProfileCard';
import ProfileEditForm from '../components/ProfileEditForm';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProfileScreen() {
  const { profile, isLoading, updateProfile, isUpdating, updateErrorMessage } = useUserViewModel();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (name: string, bio: string) => {
    if (await updateProfile({ name, bio })) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="background.default" p={4}>
        <LoadingSpinner text="Loading profile..." />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="background.default" p={4}>
        <Typography color="text.secondary">No user found</Typography>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" bgcolor="background.default" p={{ xs: 2, md: 4 }}>
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          Profile
        </Typography>

        {isEditing ? (
          <ProfileEditForm
            initialName={profile.name}
            initialBio={profile.bio ?? ''}
            isSubmitting={isUpdating}
            errorMessage={updateErrorMessage}
            onSubmit={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <UserProfileCard profile={profile} onEdit={handleEdit} isLoading={isUpdating} />
        )}
      </Container>
    </Box>
  );
}
