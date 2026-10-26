import { OctagonX } from 'lucide-react';
import { useUserViewModel } from '../hooks';
import { LoadingSpinner } from '../../../components/feedback';
import { ProfileAppearance, ProfileEditForm, UserProfileCard } from '../components';
import { Alert, AlertDescription } from '../../../components/ui';

export default function ProfileScreen() {
  const user = useUserViewModel();
  if (user.isLoading) return <main className="flex min-h-screen items-center justify-center bg-background p-4"><LoadingSpinner text="Loading profile..." /></main>;
  if (!user.profile) return <main className="flex min-h-screen items-center justify-center bg-background p-4"><p className="text-muted-foreground">No user found</p></main>;
  return (
    <main className="min-h-screen bg-background px-4 py-4 md:px-8 md:pt-10 md:pb-16">
      <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[42px] leading-[46px] font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your personal details and preferences.</p>
        </div>
        {user.errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <OctagonX />
            <AlertDescription>{user.errorMessage}</AlertDescription>
          </Alert>
        )}
        <div className="grid items-start gap-5 md:grid-cols-[280px_minmax(0,1fr)]">
          <UserProfileCard profile={user.profile} created={user.taskCounts.created} completed={user.taskCounts.completed} completedLabel={user.statusLabels.completed} />
          <div className="flex flex-col gap-5"><ProfileEditForm name={user.editName} email={user.profile.email} bio={user.editBio} isSubmitting={user.isUpdating} errorMessage={user.updateErrorMessage} onNameChange={user.setEditName} onBioChange={user.setEditBio} onSubmit={user.saveProfile} onCancel={user.cancelEditing} /><ProfileAppearance /></div>
        </div>
      </div>
    </main>
  );
}
