import type { Profile } from '../../domain/models/Profile';
import { normalizeSqliteTimestamp } from '../../../foundation/persistence/normalizeSqliteTimestamp';

export interface ProfileRow {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  created_at: string;
}

export const PROFILE_COLUMNS = 'id, name, email, avatar, bio, created_at';

export function rowToProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar: row.avatar,
    bio: row.bio,
    createdAt: normalizeSqliteTimestamp(row.created_at),
  };
}
