import type { User, UserCredentials } from '../../domain/models/User';

export interface UserRow {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  created_at: string;
}

export interface UserCredentialsRow extends UserRow {
  password_hash: string;
}

export const USER_COLUMNS = 'id, name, email, avatar, bio, created_at';

export function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar: row.avatar,
    bio: row.bio,
    createdAt: row.created_at,
  };
}

export function rowToCredentials(row: UserCredentialsRow): UserCredentials {
  return { user: rowToUser(row), passwordHash: row.password_hash };
}
