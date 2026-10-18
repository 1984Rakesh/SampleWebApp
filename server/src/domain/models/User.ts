export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  createdAt: string;
}

export interface UserCredentials {
  user: User;
  passwordHash: string;
}

export interface NewUser {
  name: string;
  email: string;
  passwordHash: string;
}

export interface UserProfileChanges {
  name?: string;
  bio?: string;
  avatar?: string;
}
