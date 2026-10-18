import { z } from 'zod';
import { TaskStatus, TaskPriority } from '../../domain/models';

const optionalNullableString = z
  .string()
  .nullish()
  .transform((value) => value ?? undefined);

export const userSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  avatar: optionalNullableString,
  bio: optionalNullableString,
  createdAt: optionalNullableString,
});

export const taskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: optionalNullableString,
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  dueDate: optionalNullableString,
  userId: z.string().min(1),
  createdAt: optionalNullableString,
  updatedAt: optionalNullableString,
});

export const authResponseSchema = z.object({
  user: userSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const refreshTokenResponseSchema = z.object({
  accessToken: z.string(),
});
