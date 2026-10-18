import { useState } from 'react';
import { useUserViewModel } from '../hooks';
import UserProfileCard from '../components/UserProfileCard';
import ProfileEditForm from '../components/ProfileEditForm';

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
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">No user found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Profile</h1>

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
      </div>
    </div>
  );
}
