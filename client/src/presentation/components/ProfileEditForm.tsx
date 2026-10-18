import type { FormEvent } from 'react';
import { UiCard, UiCardContent, UiCardHeader, UiTextField, UiButton, UiAlert, UiStack } from './ui';

interface ProfileEditFormProps {
  name: string;
  bio: string;
  isSubmitting: boolean;
  errorMessage?: string;
  onNameChange: (name: string) => void;
  onBioChange: (bio: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function ProfileEditForm({
  name,
  bio,
  isSubmitting,
  errorMessage,
  onNameChange,
  onBioChange,
  onSubmit,
  onCancel,
}: ProfileEditFormProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <UiCard>
      <UiCardHeader title="Edit Profile" />
      <UiCardContent>
        {errorMessage && (
          <UiAlert type="error" gutterBottom>
            {errorMessage}
          </UiAlert>
        )}

        <form onSubmit={handleSubmit}>
          <UiStack spacing={2}>
            <UiTextField
              id="name"
              label="Name"
              value={name}
              onChange={onNameChange}
              required
              disabled={isSubmitting}
            />
            <UiTextField
              id="bio"
              label="Bio"
              value={bio}
              onChange={onBioChange}
              disabled={isSubmitting}
              multiline
              rows={4}
            />
            <UiStack direction="row" spacing={2}>
              <UiButton
                type="submit"
                variant="solid"
                fullWidth
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Save
              </UiButton>
              <UiButton
                variant="outline"
                fullWidth
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </UiButton>
            </UiStack>
          </UiStack>
        </form>
      </UiCardContent>
    </UiCard>
  );
}
