"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { BookOpen, Clock, AlertTriangle, Search, LogOut, Home } from "lucide-react";
import MemberSidebar from "./MemberSidebar";
import { getTransactions, deleteTransaction } from "@/app/lib/api/transactions";
import { getBooks } from "@/app/lib/api/books";
import { Transaction } from "@/app/lib/schemas/transaction";
import { Book } from "@/app/lib/schemas/book";
import { getMember } from "@/app/lib/api/members";
import { Member } from "@/app/lib/schemas/member";

interface LoanWithBook extends Transaction {
  book?: Book;
}

export default function MemberDashboard() {
  const router = useRouter();
  const [loans, setLoans] = useState<LoanWithBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [memberInfo, setMemberInfo] = useState<Member | null>(null);

  // Get member ID from localStorage
  

  useEffect(() => {
    const memberID = Number(localStorage.getItem("token") || "0");
    // Redirect if no token
    if (!memberID) {
      router.push("/login");
      return;
    }

    fetchMemberLoans(memberID);
    fetchMemberInfo(memberID);
  }, [router]);

  const fetchMemberLoans = async (memberID: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get transactions for this member
      const query = new URLSearchParams();
      query.set("memberID", memberID.toString());
      const transactions = await getTransactions(query);
      
      // Get book details for each transaction
      const loansWithBooks = await Promise.all(
        transactions.map(async (transaction) => {
          try {
            const books = await getBooks();
            const book = books.find(b => b.bookID === transaction.bookID);
            return { ...transaction, book };
          } catch {
            return transaction;
          }
        })
      );
      
      setLoans(loansWithBooks);
    } catch (err) {
      setError("Failed to load your loans");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMemberInfo = async (memberID: number) => {
    try {
      const memberInfo = await getMember(memberID);
      setMemberInfo(memberInfo);
    } catch (err) {
      console.error("Failed to load member info:", err);
    }
  };

  const handleReturn = async (transactionID: number) => {
    try {
      await deleteTransaction(transactionID);
      // Refresh loans after return
      await fetchMemberLoans(memberInfo?.memberID || 0);
    } catch (err) {
      console.error("Failed to return book:", err);
    }
  };

  // Calculate stats
  const activeLoans = loans.length;
  const now = new Date();
  const dueSoon = loans.filter(loan => {
    const dueDate = new Date(loan.dueDate);
    const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  }).length;
  const overdue = loans.filter(loan => new Date(loan.dueDate) < now).length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dateString: string) => {
    return new Date(dateString) < now;
  };

  return (
    <SidebarProvider>
      <MemberSidebar memberInfo={memberInfo || { memberID: 0, firstName: "", lastName: "", email: "" }} />

      <SidebarInset>
        {/* Top Navigation */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-2">
              <Home className="h-6 w-6" />
              <h1 className="text-2xl font-semibold">Member Dashboard</h1>
            </div>
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('role');
                  router.push('/');
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "..." : activeLoans}
                </div>
                <p className="text-xs text-muted-foreground">
                  Books currently borrowed
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "..." : dueSoon}
                </div>
                <p className="text-xs text-muted-foreground">
                  Due within 7 days
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <AlertTriangle className={`h-4 w-4 ${overdue > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${overdue > 0 ? 'text-destructive' : ''}`}>
                  {loading ? "..." : overdue}
                </div>
                <p className="text-xs text-muted-foreground">
                  Require attention
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Current Loans */}
          <Card>
            <CardHeader>
              <CardTitle>Current Loans</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading your loans...</div>
              ) : error ? (
                <div className="text-center py-8 text-destructive">{error}</div>
              ) : loans.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  You have no active loans
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Title</th>
                        <th className="text-left p-2">Author</th>
                        <th className="text-left p-2">Borrowed</th>
                        <th className="text-left p-2">Due Date</th>
                        <th className="text-left p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loans.map((loan) => (
                        <tr key={loan.transactionID} className="border-b">
                          <td className="p-2 font-medium">
                            {loan.book?.bookName || `Book ID: ${loan.bookID}`}
                          </td>
                          <td className="p-2">
                            {loan.book?.authorName || "Unknown"}
                          </td>
                          <td className="p-2">
                            {formatDate(loan.borrowDate)}
                          </td>
                          <td className={`p-2 ${isOverdue(loan.dueDate) ? 'text-destructive font-medium' : ''}`}>
                            {formatDate(loan.dueDate)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}