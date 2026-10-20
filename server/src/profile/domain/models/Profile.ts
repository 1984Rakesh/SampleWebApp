export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  createdAt: string;
}

export interface ProfileChanges {
  name?: string;
  bio?: string | null;
  avatar?: string | null;
}

export interface UpdateProfileInput {
  userId: string;
  changes: ProfileChanges;
}
