import { useState, type FormEvent } from 'react';
import Stack from '@mui/material/Stack';
import { UiCard, UiCardContent, UiCardHeader, UiTextField, UiButton, UiAlert } from './ui';

interface ProfileEditFormProps {
  initialName: string;
  initialBio: string;
  isSubmitting: boolean;
  errorMessage?: string;
  onSubmit: (name: string, bio: string) => void;
  onCancel: () => void;
}

export default function ProfileEditForm({
  initialName,
  initialBio,
  isSubmitting,
  errorMessage,
  onSubmit,
  onCancel,
}: ProfileEditFormProps) {
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(name, bio);
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
              onChange={(event) => setName(event.target.value)}
              required
              disabled={isSubmitting}
            />
            <UiTextField
              id="bio"
              label="Bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
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
