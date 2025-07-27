export interface BookProps {
  bookID: number;
  isbn: string;
  bookName: string;
  authorName: string;
}

/**
 * Runtime-validated Book model.
 * Use Book.fromJSON(raw) whenever you receive untrusted JSON.
 * Throws a descriptive error if the JSON is not a valid Book.
 */
export class Book implements BookProps {
  constructor(
    public bookID: number,
    public isbn: string,
    public bookName: string,
    public authorName: string
  ) {}

  /** Factory that validates JSON and returns a Book instance */
  static fromJSON(raw: unknown): Book {
    if (!Book.isValid(raw)) {
      throw new Error('Invalid Book JSON: missing or invalid required fields');
    }
    const data = raw as BookProps;
    return new Book(data.bookID, data.isbn, data.bookName, data.authorName);
  }

  /** Narrowing type-guard: returns true iff raw satisfies BookProps */
  static isValid(raw: unknown): raw is BookProps {
    return !!raw &&
      typeof (raw as any).bookID === 'number' &&
      typeof (raw as any).isbn === 'string' &&
      typeof (raw as any).bookName === 'string' &&
      typeof (raw as any).authorName === 'string';
  }
} 