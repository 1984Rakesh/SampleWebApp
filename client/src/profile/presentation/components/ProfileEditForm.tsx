import type { FormEvent } from 'react';
import { UiAlert, UiButton, UiCard, UiCardContent, UiStack, UiText, UiTextField } from '../../../components/ui';

interface ProfileEditFormProps { name: string; email: string; bio: string; isSubmitting: boolean; errorMessage?: string; onNameChange: (name: string) => void; onBioChange: (bio: string) => void; onSubmit: () => void; onCancel: () => void }

export default function ProfileEditForm({ name, email, bio, isSubmitting, errorMessage, onNameChange, onBioChange, onSubmit, onCancel }: ProfileEditFormProps) {
  const handleSubmit = (event: FormEvent) => { event.preventDefault(); onSubmit(); };
  return (
    <UiCard><UiCardContent><UiText variant="h6" as="h2" weight="bold">Account details</UiText><UiText variant="body2" tone="muted" mb={2}>Update the name shown across the app.</UiText>{errorMessage && <UiAlert type="error" gutterBottom>{errorMessage}</UiAlert>}<form onSubmit={handleSubmit}><UiStack spacing={2}><UiTextField id="name" label="Full name" value={name} onChange={onNameChange} required disabled={isSubmitting} /><UiTextField id="email" label="Email" type="email" value={email} onChange={() => undefined} readOnly /><UiTextField id="bio" label="Bio" value={bio} onChange={onBioChange} disabled={isSubmitting} multiline rows={3} /><UiStack direction="row" spacing={1.5}><UiButton variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancel</UiButton><UiButton type="submit" variant="solid" isLoading={isSubmitting} disabled={!name.trim()}>Save changes</UiButton></UiStack></UiStack></form></UiCardContent></UiCard>
  );
}
