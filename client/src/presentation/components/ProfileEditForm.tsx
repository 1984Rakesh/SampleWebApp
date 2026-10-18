import type { FormEvent } from 'react';
import Stack from '@mui/material/Stack';
import { UiCard, UiCardContent, UiCardHeader, UiTextField, UiButton, UiAlert } from './ui';

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
          <UiAlert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </UiAlert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <UiTextField
              id="name"
              label="Name"
              type="text"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              required
              disabled={isSubmitting}
            />
            <UiTextField
              id="bio"
              label="Bio"
              value={bio}
              onChange={(event) => onBioChange(event.target.value)}
              disabled={isSubmitting}
              multiline
              rows={4}
            />
            <Stack direction="row" spacing={2}>
              <UiButton
                type="submit"
                variant="contained"
                fullWidth
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Save
              </UiButton>
              <UiButton
                type="button"
                variant="outlined"
                fullWidth
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </UiButton>
            </Stack>
          </Stack>
        </form>
      </UiCardContent>
    </UiCard>
  );
}
