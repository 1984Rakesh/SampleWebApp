import { useUserViewModel } from '../hooks';
import LoadingSpinner from '../../../components/feedback/LoadingSpinner';
import ProfileAppearance from '../components/ProfileAppearance';
import ProfileEditForm from '../components/ProfileEditForm';
import UserProfileCard from '../components/UserProfileCard';
import { UiAlert, UiAsideGrid, UiFlex, UiPage, UiScreen, UiText } from '../../../components/ui';

export default function ProfileScreen() {
  const user = useUserViewModel();
  if (user.isLoading) return <UiPage><LoadingSpinner text="Loading profile..." /></UiPage>;
  if (!user.profile) return <UiPage><UiText tone="muted">No user found</UiText></UiPage>;
  return (
    <UiScreen maxWidth="5xl">
      <UiFlex column gap={3}>
        <UiFlex column gap={1}><UiText variant="pageTitle">Profile</UiText><UiText tone="muted">Manage your personal details and preferences.</UiText></UiFlex>
        {user.errorMessage && <UiAlert type="error" gutterBottom>{user.errorMessage}</UiAlert>}
        <UiAsideGrid template="sidebar" gap={2.5}>
          <UserProfileCard profile={user.profile} created={user.taskCounts.created} completed={user.taskCounts.completed} completedLabel={user.statusLabels.completed} />
          <UiFlex column gap={2.5}><ProfileEditForm name={user.editName} email={user.profile.email} bio={user.editBio} isSubmitting={user.isUpdating} errorMessage={user.updateErrorMessage} onNameChange={user.setEditName} onBioChange={user.setEditBio} onSubmit={user.saveProfile} onCancel={user.cancelEditing} /><ProfileAppearance /></UiFlex>
        </UiAsideGrid>
      </UiFlex>
    </UiScreen>
  );
}
