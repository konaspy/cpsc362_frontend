import { z } from 'zod';

// Common validation patterns
export const PositiveInteger = z.number().int().positive();
export const NonEmptyString = z.string().min(1, 'This field is required');

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