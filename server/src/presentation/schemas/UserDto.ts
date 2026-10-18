import { z } from 'zod';

const optionalText = z
  .string({ error: 'Expected a string' })
  .nullish()
  .transform((value) => value ?? undefined);

export const updateProfileBodySchema = z.object({
  name: optionalText,
  bio: optionalText,
  avatar: optionalText,
});

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  createdAt: string;
}
