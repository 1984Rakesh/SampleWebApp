import type { FormEvent } from 'react';
import { Loader2, OctagonX } from 'lucide-react';
import { Alert, AlertDescription, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input, Label, Textarea } from '../../../components/ui';

interface ProfileEditFormProps { name: string; email: string; bio: string; isSubmitting: boolean; errorMessage?: string; onNameChange: (name: string) => void; onBioChange: (bio: string) => void; onSubmit: () => void; onCancel: () => void }

export default function ProfileEditForm({ name, email, bio, isSubmitting, errorMessage, onNameChange, onBioChange, onSubmit, onCancel }: ProfileEditFormProps) {
  const handleSubmit = (event: FormEvent) => { event.preventDefault(); onSubmit(); };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account details</CardTitle>
        <CardDescription>Update the name shown across the app.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <OctagonX />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">
                Full name
                <span aria-hidden="true" className="text-destructive">*</span>
              </Label>
              <Input id="name" value={name} onChange={(event) => onNameChange(event.target.value)} required aria-required="true" disabled={isSubmitting} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} readOnly />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" value={bio} onChange={(event) => onBioChange(event.target.value)} disabled={isSubmitting} rows={3} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2 border-t">
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting || !name.trim()}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            Save changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
