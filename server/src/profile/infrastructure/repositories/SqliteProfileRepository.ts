import type { Profile, ProfileChanges } from '../../domain/models';
import type { ProfileRepository } from '../../domain/ports';
import type { DatabaseConnection } from '../../../foundation/database/connection';
import { PROFILE_COLUMNS, rowToProfile, type ProfileRow } from '../persistence';

export class SqliteProfileRepository implements ProfileRepository {
  constructor(private readonly db: DatabaseConnection) {}

  async findById(id: string): Promise<Profile | null> {
    const row = this.db
      .prepare(`SELECT ${PROFILE_COLUMNS} FROM users WHERE id = ?`)
      .get(id) as ProfileRow | undefined;
    return row ? rowToProfile(row) : null;
  }

  async updateProfile(id: string, changes: ProfileChanges): Promise<Profile | null> {
    const row = this.db
      .prepare(
        `UPDATE users
         SET name = COALESCE(?, name),
             bio = CASE WHEN ? = 1 THEN ? ELSE bio END,
             avatar = CASE WHEN ? = 1 THEN ? ELSE avatar END
         WHERE id = ?
         RETURNING ${PROFILE_COLUMNS}`
      )
      .get(
        changes.name ?? null,
        changes.bio !== undefined ? 1 : 0,
        changes.bio ?? null,
        changes.avatar !== undefined ? 1 : 0,
        changes.avatar ?? null,
        id
      ) as ProfileRow | undefined;
    return row ? rowToProfile(row) : null;
  }
}
