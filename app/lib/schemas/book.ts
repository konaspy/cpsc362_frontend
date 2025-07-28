import { z } from 'zod';
import { PositiveInteger, NonEmptyString } from './common';

// Core Book schema for database entities
export const BookSchema = z.object({
  bookID: PositiveInteger,
  isbn: NonEmptyString,
  bookName: NonEmptyString,
  authorName: NonEmptyString
});

// Inferred TypeScript type
export type Book = z.infer<typeof BookSchema>;

// Schema for creating new books (no bookID)
export const CreateBookSchema = BookSchema.omit({ bookID: true });

// Schema for updating books (all fields optional except bookID)
export const UpdateBookSchema = BookSchema.partial().omit({ bookID: true });

// Inferred types for requests
export type CreateBookRequest = z.infer<typeof CreateBookSchema>;
export type UpdateBookRequest = z.infer<typeof UpdateBookSchema>;

// Optional: Class wrapper if you need methods
export class BookModel {
  static schema = BookSchema;

  constructor(private readonly props: Book) {}

  // Accept already-validated data
  static wrap(data: Book): BookModel {
    return new BookModel(data);
  }

  // Optional: convenience method for parsing + wrapping
  static parse(raw: unknown): BookModel {
    return BookModel.wrap(BookSchema.parse(raw));
  }

  get displayTitle(): string {
    return `${this.props.bookName} by ${this.props.authorName}`;
  }

  toJSON(): Book {
    return this.props;
  }
} 