import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export type DatabaseConnection = Database.Database;

export function createDatabase(dbPath: string): DatabaseConnection {
  const dbDir = path.dirname(dbPath);

  // Ensure database directory exists
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const db = new Database(dbPath);

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  return db;
}
