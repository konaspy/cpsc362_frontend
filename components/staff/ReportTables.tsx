"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Transaction, Book, Member } from "@/app/lib/schemas";
import { ReportType } from "@/app/lib/api";
import { BookOpen, User, Calendar, Clock, AlertTriangle } from "lucide-react";

interface ReportTableProps {
  data: any[];
  loading: boolean;
  error: Error | null;
  reportType: ReportType;
}

// Summary report types based on API documentation
interface OverdueSummary {
  transactionID: number;
  memberID: number;
  bookID: number;
  memberFirstName: string;
  memberLastName: string;
  bookName: string;
  borrowDate: string;
  dueDate: string;
}

interface BorrowingSummary {
  transactionID: number;
  memberID: number;
  bookID: number;
  memberFirstName: string;
  memberLastName: string;
  bookName: string;
  borrowDate: string;
  dueDate: string;
}

export function ReportTable({ data, loading, error, reportType }: ReportTableProps) {
  // Debug: Log what we're actually receiving
  console.log('ReportTable called with:', { 
    reportType, 
    dataLength: data.length, 
    loading, 
    firstItem: data[0],
    dataType: data.length > 0 ? (data[0].hasOwnProperty('transactionID') ? 'transaction' : data[0].hasOwnProperty('bookID') && data[0].hasOwnProperty('memberID') ? 'member' : 'unknown') : 'empty'
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-destructive">Error: {error.message}</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No data found for {getReportDisplayName(reportType)}
      </div>
    );
  }

  return (
    <div className="space-y-4" key={reportType}>
      {renderReportTable(data, reportType)}
    </div>
  );
}

function getReportDisplayName(reportType: ReportType): string {
  const reportNames: Record<ReportType, string> = {
    "transactions": "transactions",
    "transactions-overdue": "overdue transactions",
    "transactions-compliant": "compliant transactions",
    "members": "members",
    "members-overdue": "members with overdue books",
    "members-borrowing": "members currently borrowing",
    "books": "books",
    "books-overdue": "overdue books",
    "books-available": "available books",
    "overdue-summary": "overdue summary",
    "borrowing-summary": "borrowing summary",
  };
  return reportNames[reportType] || reportType;
}

function renderReportTable(data: any[], reportType: ReportType) {
  switch (reportType) {
    case "transactions":
    case "transactions-overdue":
    case "transactions-compliant":
      return <TransactionsTable data={data as Transaction[]} reportType={reportType} />;
    
    case "members":
    case "members-overdue":
    case "members-borrowing":
      return <MembersTable data={data as Member[]} reportType={reportType} />;
    
    case "books":
    case "books-overdue":
    case "books-available":
      return <BooksTable data={data as Book[]} reportType={reportType} />;
    
    case "overdue-summary":
      return <OverdueSummaryTable data={data as OverdueSummary[]} />;
    
    case "borrowing-summary":
      return <BorrowingSummaryTable data={data as BorrowingSummary[]} />;
    
    default:
      return <div>Unsupported report type: {reportType}</div>;
  }
}

function TransactionsTable({ data, reportType }: { data: Transaction[]; reportType: ReportType }) {
  const isOverdue = reportType === "transactions-overdue";
  
  return (
    <div className="space-y-3">
      {data.map((transaction, index) => {
        const daysOverdue = isOverdue ? 
          Math.floor((Date.now() - new Date(transaction.dueDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
        
        return (
          <Card key={`${reportType}-txn-${transaction.transactionID || index}`} className={`p-4 ${isOverdue ? 'border-red-200' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${isOverdue ? 'bg-red-50' : 'bg-blue-50'}`}>
                  <BookOpen className={`h-4 w-4 ${isOverdue ? 'text-red-600' : 'text-blue-600'}`} />
                </div>
                <div>
                  <p className="font-medium">Transaction #{transaction.transactionID}</p>
                  <p className="text-sm text-muted-foreground">
                    Book ID: {transaction.bookID} • Member ID: {transaction.memberID}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {isOverdue && (
                  <Badge variant="destructive" className="mb-2">
                    {daysOverdue} day{daysOverdue !== 1 ? 's' : ''} overdue
                  </Badge>
                )}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Due: {new Date(transaction.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                  <Clock className="h-3 w-3" />
                  <span>Borrowed: {new Date(transaction.borrowDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function BooksTable({ data, reportType }: { data: Book[]; reportType: ReportType }) {
  const getBookStatusColor = (reportType: ReportType) => {
    switch (reportType) {
      case "books-overdue": return { bg: "bg-red-50", text: "text-red-600" };
      case "books-available": return { bg: "bg-green-50", text: "text-green-600" };
      default: return { bg: "bg-blue-50", text: "text-blue-600" };
    }
  };

  const getStatusBadge = (reportType: ReportType) => {
    switch (reportType) {
      case "books-overdue": return <Badge variant="destructive">Overdue</Badge>;
      case "books-available": return <Badge variant="secondary" className="bg-green-100 text-green-800">Available</Badge>;
      default: return <Badge variant="outline">Book</Badge>;
    }
  };

  const { bg, text } = getBookStatusColor(reportType);

  return (
    <div className="space-y-3">
      {data.map((book, index) => (
        <Card key={`${reportType}-book-${book.bookID || index}`} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-2 ${bg} rounded-lg`}>
                <BookOpen className={`h-4 w-4 ${text}`} />
              </div>
              <div>
                <p className="font-medium">{book.bookName}</p>
                <p className="text-sm text-muted-foreground">by {book.authorName}</p>
                <p className="text-xs text-muted-foreground">ISBN: {book.isbn}</p>
              </div>
            </div>
            <div className="text-right space-y-2">
              {getStatusBadge(reportType)}
              <div>
                <Badge variant="outline">ID: {book.bookID}</Badge>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function MembersTable({ data, reportType }: { data: Member[]; reportType: ReportType }) {
  const getMemberStatusColor = (reportType: ReportType) => {
    switch (reportType) {
      case "members-overdue": return { bg: "bg-red-50", text: "text-red-600" };
      case "members-borrowing": return { bg: "bg-yellow-50", text: "text-yellow-600" };
      default: return { bg: "bg-purple-50", text: "text-purple-600" };
    }
  };

  const getStatusBadge = (reportType: ReportType) => {
    switch (reportType) {
      case "members-overdue": return <Badge variant="destructive">Has Overdue Books</Badge>;
      case "members-borrowing": return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Currently Borrowing</Badge>;
      default: return <Badge variant="outline">Member</Badge>;
    }
  };

  const { bg, text } = getMemberStatusColor(reportType);

  return (
    <div className="space-y-3">
      {data.map((member, index) => (
        <Card key={`${reportType}-member-${member.memberID || index}`} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-2 ${bg} rounded-lg`}>
                <User className={`h-4 w-4 ${text}`} />
              </div>
              <div>
                <p className="font-medium">{member.firstName} {member.lastName}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
            </div>
            <div className="text-right space-y-2">
              {getStatusBadge(reportType)}
              <div>
                <Badge variant="outline">ID: {member.memberID}</Badge>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function OverdueSummaryTable({ data }: { data: OverdueSummary[] }) {
  return (
    <div className="space-y-3">
      {data.map((summary, index) => {
        const daysOverdue = Math.floor((Date.now() - new Date(summary.dueDate).getTime()) / (1000 * 60 * 60 * 24));
        
        return (
          <Card key={`overdue-summary-${summary.transactionID || index}`} className="p-4 border-red-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">{summary.bookName}</p>
                  <p className="text-sm text-muted-foreground">
                    Borrowed by {summary.memberFirstName} {summary.memberLastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Transaction #{summary.transactionID} • Member ID: {summary.memberID} • Book ID: {summary.bookID}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="destructive" className="mb-2">
                  {daysOverdue} day{daysOverdue !== 1 ? 's' : ''} overdue
                </Badge>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Due: {new Date(summary.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function BorrowingSummaryTable({ data }: { data: BorrowingSummary[] }) {
  return (
    <div className="space-y-3">
      {data.map((summary, index) => (
        <Card key={`borrowing-summary-${summary.transactionID || index}`} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">{summary.bookName}</p>
                <p className="text-sm text-muted-foreground">
                  Borrowed by {summary.memberFirstName} {summary.memberLastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  Transaction #{summary.transactionID} • Member ID: {summary.memberID} • Book ID: {summary.bookID}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                <Calendar className="h-3 w-3" />
                <span>Due: {new Date(summary.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Borrowed: {new Date(summary.borrowDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 