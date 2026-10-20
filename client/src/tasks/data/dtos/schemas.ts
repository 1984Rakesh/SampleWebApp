import { z } from 'zod';
import { TaskStatus, TaskPriority } from '../../domain/models';

const optionalNullableString = z.string().nullish().transform((value) => value ?? undefined);
export const taskSchema = z.object({
  id: z.string().min(1), title: z.string().min(1), description: optionalNullableString,
  status: z.nativeEnum(TaskStatus), priority: z.nativeEnum(TaskPriority), dueDate: optionalNullableString,
  userId: z.string().min(1), createdAt: optionalNullableString, updatedAt: optionalNullableString,
});
