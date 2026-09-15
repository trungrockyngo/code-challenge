import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address format'),
  role: z.enum(['admin', 'user']).default('user'),
});

export const UpdateUserSchema = CreateUserSchema.partial();

export const UserFilterSchema = z.object({
  role: z.enum(['admin', 'user']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
export type UserFilters = z.infer<typeof UserFilterSchema>;