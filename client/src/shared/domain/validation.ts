import { ValidationError } from './errors';

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function normalizeEmail(email: string): string {
  const value = email?.trim().toLowerCase() ?? '';
  if (!value) throw new ValidationError('Email is required');
  if (!isValidEmail(value)) throw new ValidationError('Invalid email format');
  return value;
}

export function normalizeName(name: string): string {
  const value = name?.trim() ?? '';
  if (!value) throw new ValidationError('Name cannot be empty');
  return value;
}

export function normalizeOptionalText(value: string | null | undefined): string | null | undefined {
  return value === undefined ? undefined : value === null ? null : value.trim() || null;
}
