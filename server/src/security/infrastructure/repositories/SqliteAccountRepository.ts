import { randomUUID } from 'crypto';
import Database from 'better-sqlite3';
import { ConflictError } from '../../../shared/domain/errors';
import type { AccountCredentials, AccountIdentity, NewAccount, SessionAccount } from '../../domain/models';
import type { AccountRepository } from '../../domain/ports';
import type { DatabaseConnection } from '../../../foundation/database/connection';
import {
  ACCOUNT_COLUMNS,
  rowToAccount,
  rowToCredentials,
  rowToIdentity,
  type AccountRow,
  type AccountCredentialsRow,
  type AccountIdentityRow,
} from '../persistence';

export class SqliteAccountRepository implements AccountRepository {
  constructor(private readonly db: DatabaseConnection) {}

  async findIdentityById(id: string): Promise<AccountIdentity | null> {
    const row = this.db.prepare('SELECT id, email FROM users WHERE id = ?').get(id) as AccountIdentityRow | undefined;
    return row ? rowToIdentity(row) : null;
  }

  async findCredentialsByEmail(email: string): Promise<AccountCredentials | null> {
    const row = this.db
      .prepare(`SELECT ${ACCOUNT_COLUMNS}, password_hash FROM users WHERE email = ?`)
      .get(email) as AccountCredentialsRow | undefined;
    return row ? rowToCredentials(row) : null;
  }

  async create(account: NewAccount): Promise<SessionAccount> {
    try {
      const row = this.db
        .prepare(
          `INSERT INTO users (id, name, email, password_hash)
           VALUES (?, ?, ?, ?)
           RETURNING ${ACCOUNT_COLUMNS}`
        )
        .get(randomUUID(), account.name, account.email, account.passwordHash) as AccountRow;
      return rowToAccount(row);
    } catch (error) {
      if (error instanceof Database.SqliteError && error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new ConflictError('Email is already registered');
      }
      throw error;
    }
  }
}
