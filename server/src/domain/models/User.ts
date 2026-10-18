import { ValidationError } from '../errors';

export const MIN_PASSWORD_LENGTH = 6;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  bio?: string | null;
  avatar?: string | null;
}

export function normalizeUserName(name: string): string {
  const normalized = name.trim();
  if (!normalized) {
    throw new ValidationError('Name cannot be empty');
  }
  return normalized;
}

export function normalizeEmail(email: string): string {
  const normalized = email.trim().toLowerCase();
  if (!normalized) {
    throw new ValidationError('Email is required');
  }
  if (!EMAIL_REGEX.test(normalized)) {
    throw new ValidationError('Invalid email format');
  }
  return normalized;
}

export function validatePassword(password: string): string {
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    throw new ValidationError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }
  return password;
}
