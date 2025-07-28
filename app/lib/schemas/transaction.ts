import { z } from 'zod';
import { PositiveInteger } from './common';

// Core Transaction schema for database entities
export const TransactionSchema = z.object({
  transactionID: PositiveInteger,
  bookID: PositiveInteger,
  memberID: PositiveInteger,
  borrowDate: z.iso.datetime(),
  dueDate: z.iso.datetime()
}).refine(
  (data) => new Date(data.dueDate) > new Date(data.borrowDate),
  { 
    message: 'Due date must be after borrow date',
    path: ['dueDate']
  }
);

// Inferred TypeScript type
export type Transaction = z.infer<typeof TransactionSchema>;

// Schema for creating new transactions (no transactionID, dates can be auto-generated)
export const CreateTransactionSchema = z.object({
  bookID: PositiveInteger,
  memberID: PositiveInteger,
});

// Schema for updating transactions (all fields optional except transactionID)
export const UpdateTransactionSchema = TransactionSchema.partial().omit({ transactionID: true });

// Inferred types for requests
export type CreateTransactionRequest = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransactionRequest = z.infer<typeof UpdateTransactionSchema>;

// Optional: Class wrapper if you need methods
export class TransactionModel {
  static schema = TransactionSchema;

  constructor(private readonly props: Transaction) {}

  // Accept already-validated data
  static wrap(data: Transaction): TransactionModel {
    return new TransactionModel(data);
  }

  // Optional: convenience method for parsing + wrapping
  static parse(raw: unknown): TransactionModel {
    return TransactionModel.wrap(TransactionSchema.parse(raw));
  }

  get isOverdue(): boolean {
    return new Date() > new Date(this.props.dueDate);
  }

  get daysUntilDue(): number {
    const now = new Date();
    const due = new Date(this.props.dueDate);
    const diffTime = due.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get borrowDuration(): number {
    const borrow = new Date(this.props.borrowDate);
    const due = new Date(this.props.dueDate);
    const diffTime = due.getTime() - borrow.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  toJSON(): Transaction {
    return this.props;
  }
} 