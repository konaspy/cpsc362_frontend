export interface TransactionProps {
  transactionID: number;
  bookID: number;
  memberID: number;
  borrowDate: string; // ISO 8601 format
  dueDate: string;    // ISO 8601 format
}

/**
 * Runtime-validated Transaction model.
 * Use Transaction.fromJSON(raw) whenever you receive untrusted JSON.
 * Throws a descriptive error if the JSON is not a valid Transaction.
 */
export class Transaction implements TransactionProps {
  constructor(
    public transactionID: number,
    public bookID: number,
    public memberID: number,
    public borrowDate: string,
    public dueDate: string
  ) {}

  /** Factory that validates JSON and returns a Transaction instance */
  static fromJSON(raw: unknown): Transaction {
    if (!Transaction.isValid(raw)) {
      throw new Error('Invalid Transaction JSON: missing or invalid required fields');
    }
    const data = raw as TransactionProps;
    return new Transaction(
      data.transactionID,
      data.bookID,
      data.memberID,
      data.borrowDate,
      data.dueDate
    );
  }

  /** Narrowing type-guard: returns true iff raw satisfies TransactionProps */
  static isValid(raw: unknown): raw is TransactionProps {
    return !!raw &&
      typeof (raw as any).transactionID === 'number' &&
      typeof (raw as any).bookID === 'number' &&
      typeof (raw as any).memberID === 'number' &&
      typeof (raw as any).borrowDate === 'string' &&
      typeof (raw as any).dueDate === 'string';
  }
} 