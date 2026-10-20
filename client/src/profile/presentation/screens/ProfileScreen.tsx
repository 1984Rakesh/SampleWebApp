import { useUserViewModel } from '../hooks';
import LoadingSpinner from '../../../components/feedback/LoadingSpinner';
import ProfileAppearance from '../components/ProfileAppearance';
import ProfileEditForm from '../components/ProfileEditForm';
import UserProfileCard from '../components/UserProfileCard';
import { UiAlert, UiFlex, UiGrid, UiGridItem, UiPage, UiScreen, UiText } from '../../../components/ui';

export default function ProfileScreen() {
  const user = useUserViewModel();
  if (user.isLoading) return <UiPage><LoadingSpinner text="Loading profile..." /></UiPage>;
  if (!user.profile) return <UiPage><UiText tone="muted">No user found</UiText></UiPage>;
  return (
    <UiScreen maxWidth="lg">
      <UiFlex column gap={1} mb={4}><UiText variant="h4" as="h1" weight="bold">Profile</UiText><UiText tone="muted">Manage your personal details and preferences.</UiText></UiFlex>
      {user.errorMessage && <UiAlert type="error" gutterBottom>{user.errorMessage}</UiAlert>}
      <UiGrid spacing={3}>
        <UiGridItem md={4}><UserProfileCard profile={user.profile} created={user.taskCounts.created} completed={user.taskCounts.completed} /></UiGridItem>
        <UiGridItem md={8}><UiFlex column gap={3}><ProfileEditForm name={user.editName} email={user.profile.email} bio={user.editBio} isSubmitting={user.isUpdating} errorMessage={user.updateErrorMessage} onNameChange={user.setEditName} onBioChange={user.setEditBio} onSubmit={user.saveProfile} onCancel={user.cancelEditing} /><ProfileAppearance /></UiFlex></UiGridItem>
      </UiGrid>
    </UiScreen>
  );
}
