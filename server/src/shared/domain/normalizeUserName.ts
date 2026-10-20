import { ValidationError } from './errors';

export function normalizeUserName(name: string): string {
  const normalized = name.trim();
  if (!normalized) throw new ValidationError('Name cannot be empty');
  return normalized;
}
