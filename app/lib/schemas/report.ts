import { Book, Member, Transaction } from "./index";

export interface BooksReport {
  books: Book[];
}

export interface MembersReport {
  members: Member[];
}

export interface TransactionsReport {
  transactions: Transaction[];
}

export interface SummaryReport {
  summaries: Array<{
    transactionID: number;
    memberID: number;
    bookID: number;
    memberFirstName: string;
    memberLastName: string;
    bookName: string;
    borrowDate: string;
    dueDate: string;
  }>;
} 