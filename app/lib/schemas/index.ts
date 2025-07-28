// Barrel exports for all schemas
export * from './book';
export * from './member'; 
export * from './transaction';
export * from './common';

// Re-export commonly used Zod utilities
import { ZodError } from 'zod';
export { z, ZodError } from 'zod';

// Utility function for API error handling
export function handleZodError(error: unknown) {
  if (error instanceof ZodError) {
    const zodError = error as ZodError;
    return {
      type: 'validation-error',
      title: 'Validation Failed',
      status: 400,
      detail: 'The request contains invalid data',
      'invalid-params': zodError.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`)
    };
  }
  throw error;
} 