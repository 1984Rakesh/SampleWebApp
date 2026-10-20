import { z } from 'zod';

const optionalText = z.string().nullish().transform((value) => value ?? undefined);
export const profileSchema = z.object({
  id: z.string().trim().min(1), name: z.string().trim().min(1), email: z.string().trim().toLowerCase().email(),
  avatar: optionalText, bio: optionalText, createdAt: optionalText,
});
