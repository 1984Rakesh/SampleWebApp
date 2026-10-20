import { z } from 'zod';

const optionalText = z.string().nullish().transform((value) => value ?? undefined);
export const accountSchema = z.object({
  id: z.string().trim().min(1), name: z.string().trim().min(1), email: z.string().trim().toLowerCase().email(),
  avatar: optionalText, bio: optionalText, createdAt: optionalText,
});
export const authResponseSchema = z.object({
  user: accountSchema, accessToken: z.string().min(1), refreshToken: z.string().min(1),
});
export const refreshTokenResponseSchema = z.object({ accessToken: z.string().min(1) });
