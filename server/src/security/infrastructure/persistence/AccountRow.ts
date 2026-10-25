import type { AccountCredentials, AccountIdentity, SessionAccount } from '../../domain/models';
import { normalizeSqliteTimestamp } from '../../../foundation/persistence/normalizeSqliteTimestamp';

export interface AccountIdentityRow {
  id: string;
  email: string;
}

export interface AccountRow extends AccountIdentityRow {
  name: string;
  avatar: string | null;
  bio: string | null;
  created_at: string;
}

export interface AccountCredentialsRow extends AccountRow {
  password_hash: string;
}

export const ACCOUNT_COLUMNS = 'id, name, email, avatar, bio, created_at';

export function rowToIdentity(row: AccountIdentityRow): AccountIdentity {
  return { id: row.id, email: row.email };
}

export function rowToAccount(row: AccountRow): SessionAccount {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar: row.avatar,
    bio: row.bio,
    createdAt: normalizeSqliteTimestamp(row.created_at),
  };
}

export function rowToCredentials(row: AccountCredentialsRow): AccountCredentials {
  return { account: rowToAccount(row), passwordHash: row.password_hash };
}
