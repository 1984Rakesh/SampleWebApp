import { Avatar, AvatarFallback, AvatarImage, Badge, Card, CardContent } from '../../../components/ui';
import type { UserProfileViewState } from '../models';

interface UserProfileCardProps { profile: UserProfileViewState; created: number; completed: number; completedLabel: string }

export default function UserProfileCard({ profile, created, completed, completedLabel }: UserProfileCardProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col items-center gap-3 text-center">
          <Avatar className="size-20">
            <AvatarImage src={profile.avatarUrl} alt={profile.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-display font-semibold">{profile.initial}</AvatarFallback>
          </Avatar>
          <h2 className="font-display text-xl font-semibold">{profile.name}</h2>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
          {profile.joinedLabel && <Badge variant="secondary">{`Joined ${profile.joinedLabel}`}</Badge>}
        </div>
        <div className="mt-4 flex justify-between border-t pt-4 text-center">
          <div className="flex flex-1 flex-col"><span className="font-display text-2xl font-bold">{created}</span><span className="text-sm text-muted-foreground">Created</span></div>
          <div className="flex flex-1 flex-col"><span className="font-display text-2xl font-bold">{completed}</span><span className="text-sm text-muted-foreground">{completedLabel}</span></div>
        </div>
      </CardContent>
    </Card>
  );
}
