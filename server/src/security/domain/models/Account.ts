import { ValidationError } from '../../../shared/domain/errors';

export interface AccountIdentity {
  id: string;
  email: string;
}

export interface SessionAccount extends AccountIdentity {
  name: string;
  avatar: string | null;
  bio: string | null;
  createdAt: string;
}

export interface AccountCredentials {
  account: SessionAccount;
  passwordHash: string;
}

export interface NewAccount {
  name: string;
  email: string;
  passwordHash: string;
}

export const MIN_PASSWORD_LENGTH = 6;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: string): string {
  const normalized = email.trim().toLowerCase();
  if (!normalized) throw new ValidationError('Email is required');
  if (!EMAIL_REGEX.test(normalized)) throw new ValidationError('Invalid email format');
  return normalized;
}

export function validatePassword(password: string): string {
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    throw new ValidationError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }
  return password;
}
