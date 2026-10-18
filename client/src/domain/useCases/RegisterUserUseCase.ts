import type { User } from '../models';

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export interface RegisterUserOutput {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export async function registerUserUseCase(
  input: RegisterUserInput
): Promise<RegisterUserOutput> {
  if (!input.name || input.name.trim().length === 0) {
    throw new Error('Name is required');
  }

  if (!input.email || input.email.trim().length === 0) {
    throw new Error('Email is required');
  }

  if (!isValidEmail(input.email)) {
    throw new Error('Invalid email format');
  }

  if (!input.password || input.password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  // This would normally call the repository/API
  // For now, we'll define the interface
  throw new Error('Repository not implemented');
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
