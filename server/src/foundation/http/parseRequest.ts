import type { z } from 'zod';
import { ValidationError } from '../../shared/domain';

export function parseRequest<TSchema extends z.ZodType>(
  schema: TSchema,
  value: unknown
): z.output<TSchema> {
  const result = schema.safeParse(value ?? {});
  if (!result.success) {
    throw new ValidationError(result.error.issues[0]?.message ?? 'Invalid request');
  }
  return result.data;
}
