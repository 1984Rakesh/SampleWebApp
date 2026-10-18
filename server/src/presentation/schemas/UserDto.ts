import { z } from 'zod';

const optionalText = z
  .string({ error: 'Expected a string' })
  .nullish()
  .transform((value) => value ?? undefined);
const clearableText = z.string({ error: 'Expected a string' }).nullish();

export const updateProfileBodySchema = z.object({
  name: optionalText,
  bio: clearableText,
  avatar: clearableText,
});

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  createdAt: string;
}
