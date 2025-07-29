import { z } from 'zod';

// Common validation patterns
export const PositiveInteger = z.number().int().positive();
export const NonEmptyString = z.string().min(1, 'This field is required');

// Custom password schema that can be detected by form generators
export const PasswordSchema = z.string()
  .min(6, 'Password must be at least 6 characters')
  .refine((val) => val.length > 0, 'Password is required')
  // Add a custom property to identify this as a password field
  .brand('password');

// Convenience function for creating password schemas with custom validation
export const password = (minLength = 6, customMessage?: string) => 
  z.string()
    .min(minLength, customMessage || `Password must be at least ${minLength} characters`)
    .brand('password');

// Export types
export type Password = z.infer<typeof PasswordSchema>;

// Common response schemas
export const ProblemDetailsSchema = z.object({
  type: z.string(),
  title: z.string(),
  status: z.number(),
  detail: z.string(),
  data: z.any().optional(),
  'invalid-params': z.array(z.string()).optional()
});

export type ProblemDetails = z.infer<typeof ProblemDetailsSchema>;

// // Pagination schemas
// export const PaginationParamsSchema = z.object({
//   page: z.coerce.number().int().min(1).default(1),
//   limit: z.coerce.number().int().min(1).max(100).default(10)
// });

// export const PaginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
//   z.object({
//     items: z.array(itemSchema),
//     pagination: z.object({
//       page: z.number(),
//       limit: z.number(),
//       total: z.number(),
//       totalPages: z.number()
//     })
//   });

// export type PaginationParams = z.infer<typeof PaginationParamsSchema>;

// Search/filter schemas

// ID lookup schema for wildcard edit dialogs
export const IdLookupSchema = z.object({
  id: z.number({ message: 'ID is required' })
        .int()
        .positive('ID must be positive'),
});

export type IdLookup = z.infer<typeof IdLookupSchema>;