import { randomUUID } from 'crypto';
import Database from 'better-sqlite3';
import { ConflictError } from '../../domain/errors';
import type { NewUser, User, UserCredentials, UserProfileChanges } from '../../domain/models/User';
import type { UserRepository } from '../../domain/ports/UserRepository';
import type { DatabaseConnection } from '../database/connection';
import {
  USER_COLUMNS,
  rowToCredentials,
  rowToUser,
  type UserCredentialsRow,
  type UserRow,
} from '../persistence/UserRow';

export class SqliteUserRepository implements UserRepository {
  constructor(private readonly db: DatabaseConnection) {}

  async findById(id: string): Promise<User | null> {
    const row = this.db
      .prepare(`SELECT ${USER_COLUMNS} FROM users WHERE id = ?`)
      .get(id) as UserRow | undefined;
    return row ? rowToUser(row) : null;
  }

  async findCredentialsByEmail(email: string): Promise<UserCredentials | null> {
    const row = this.db
      .prepare(`SELECT ${USER_COLUMNS}, password_hash FROM users WHERE email = ?`)
      .get(email) as UserCredentialsRow | undefined;
    return row ? rowToCredentials(row) : null;
  }

  async create(user: NewUser): Promise<User> {
    try {
      const row = this.db
        .prepare(
          `INSERT INTO users (id, name, email, password_hash)
           VALUES (?, ?, ?, ?)
           RETURNING ${USER_COLUMNS}`
        )
        .get(randomUUID(), user.name, user.email, user.passwordHash) as UserRow;
      return rowToUser(row);
    } catch (error) {
      if (error instanceof Database.SqliteError && error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new ConflictError('Email is already registered');
      }
      throw error;
    }
  }

  async updateProfile(id: string, changes: UserProfileChanges): Promise<User | null> {
    const row = this.db
      .prepare(
        `UPDATE users
         SET name = COALESCE(?, name),
             bio = COALESCE(?, bio),
             avatar = COALESCE(?, avatar)
         WHERE id = ?
         RETURNING ${USER_COLUMNS}`
      )
      .get(changes.name ?? null, changes.bio ?? null, changes.avatar ?? null, id) as
      | UserRow
      | undefined;
    return row ? rowToUser(row) : null;
  }
}
