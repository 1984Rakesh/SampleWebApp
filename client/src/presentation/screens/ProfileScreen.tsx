import { useUserViewModel } from '../hooks';
import UserProfileCard from '../components/UserProfileCard';
import ProfileEditForm from '../components/ProfileEditForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { UiPage, UiScreen, UiText } from '../components/ui';

export default function ProfileScreen() {
  const {
    profile,
    isLoading,
    isEditing,
    editName,
    editBio,
    setEditName,
    setEditBio,
    startEditing,
    cancelEditing,
    saveProfile,
    isUpdating,
    updateErrorMessage,
  } = useUserViewModel();

  if (isLoading) {
    return (
      <UiPage>
        <LoadingSpinner text="Loading profile..." />
      </UiPage>
    );
  }

  if (!profile) {
    return (
      <UiPage>
        <UiText tone="muted">No user found</UiText>
      </UiPage>
    );
  }

  return (
    <UiScreen maxWidth="md">
      <UiText variant="h4" as="h1" weight="bold" gutterBottom>
        Profile
      </UiText>

      {isEditing ? (
        <ProfileEditForm
          name={editName}
          bio={editBio}
          isSubmitting={isUpdating}
          errorMessage={updateErrorMessage}
          onNameChange={setEditName}
          onBioChange={setEditBio}
          onSubmit={saveProfile}
          onCancel={cancelEditing}
        />
      ) : (
        <UserProfileCard profile={profile} onEdit={startEditing} isLoading={isUpdating} />
      )}
    </UiScreen>
  );
}
