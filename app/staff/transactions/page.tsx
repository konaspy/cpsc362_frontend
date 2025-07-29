"use client";

import { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import StaffSidebar from "@/components/staff/StaffSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Receipt, Search, BookCheck, Trash, Clock, CheckCircle, AlertTriangle, X } from "lucide-react";
import { type Transaction } from "@/app/lib/schemas";
import { getTransactions } from "@/app/lib/api/transactions";
import { AddTransactionDialog, DeleteTransactionDialog } from "@/components/dialogs/transactionDialogs";
import { useReportCounts } from "@/hooks/use-report-counts";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchForm, setSearchForm] = useState({
    transactionID: "",
    bookID: "",
    memberID: ""
  });

  const { loading: cardLoading, error: cardError, counts } = useReportCounts({
    total: "transactions",
    compliant: "transactions-compliant",
    overdue: "transactions-overdue",
  });

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    try {
      setLoading(true); 
      
      const searchParams = new URLSearchParams();
      if (searchForm.transactionID) searchParams.append('transactionID', searchForm.transactionID);
      if (searchForm.bookID) searchParams.append('bookID', searchForm.bookID);
      if (searchForm.memberID) searchParams.append('memberID', searchForm.memberID);
      
      const data = await getTransactions(searchParams);
      setTransactions(data);
    } catch (error) {
      console.error('Error searching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchForm({ transactionID: "", bookID: "", memberID: "" });
    // Reload all transactions when clearing
    fetchAllTransactions();
  };

  const fetchAllTransactions = async () => {
    try {
      setLoading(true);
      const transactionsList = await getTransactions();
      setTransactions(transactionsList);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  // Since we're doing server-side search, we don't need client-side filtering
  const filteredTransactions = transactions;

  // Helper function to check if transaction is overdue
  const isOverdue = (transaction: Transaction) => {
    return new Date() > new Date(transaction.dueDate);
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <SidebarProvider>
      <StaffSidebar />
      
      <SidebarInset>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Receipt className="h-6 w-6" />
            <h1 className="text-2xl font-semibold">Transactions</h1>
          </div>
          <div className="flex gap-2">
            <AddTransactionDialog
              trigger={
                <Button>
                  <Receipt className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              }
              onSuccess={fetchAllTransactions}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cardLoading ? "..." : cardError ? "—" : counts.total ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                All library transactions
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Transactions</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cardLoading ? "..." : cardError ? "—" : counts.compliant ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Books currently borrowed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Transactions</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cardLoading ? "..." : cardError ? "—" : counts.overdue ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Past due date
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Table */}
        <div className="p-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Search Transactions</CardTitle>
                <form onSubmit={handleSearch} className="flex items-center space-x-2">
                  <Input
                    placeholder="Transaction ID..."
                    value={searchForm.transactionID}
                    onChange={(e) => setSearchForm(prev => ({ ...prev, transactionID: e.target.value }))}
                    className="w-32"
                  />
                  <Input
                    placeholder="Book ID..."
                    value={searchForm.bookID}
                    onChange={(e) => setSearchForm(prev => ({ ...prev, bookID: e.target.value }))}
                    className="w-32"
                  />
                  <Input
                    placeholder="Member ID..."
                    value={searchForm.memberID}
                    onChange={(e) => setSearchForm(prev => ({ ...prev, memberID: e.target.value }))}
                    className="w-32"
                  />
                  <Button 
                    type="submit"
                    size="sm" 
                    className="flex items-center gap-2"
                  >
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm" 
                    onClick={handleClear}
                    className="flex items-center gap-2"
                    disabled={!searchForm.transactionID && !searchForm.bookID && !searchForm.memberID}
                  >
                    <X className="h-4 w-4" />
                    Clear
                  </Button>
                </form>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading transactions...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Transaction ID</th>
                        <th className="text-left py-3 px-4 font-medium">Book ID</th>
                        <th className="text-left py-3 px-4 font-medium">Member ID</th>
                        <th className="text-left py-3 px-4 font-medium">Borrow Date</th>
                        <th className="text-left py-3 px-4 font-medium">Due Date</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-muted-foreground">
                            {(searchForm.transactionID || searchForm.bookID || searchForm.memberID) ? 'No transactions found matching your search.' : 'No transactions found.'}
                          </td>
                        </tr>
                      ) : (
                        filteredTransactions.map((transaction) => (
                          <tr 
                            key={transaction.transactionID} 
                            className={`border-b hover:bg-muted/50 ${isOverdue(transaction) ? 'bg-red-50' : ''}`}
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-sm">{transaction.transactionID}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-mono text-sm">{transaction.bookID}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-mono text-sm">{transaction.memberID}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm">{formatDate(transaction.borrowDate)}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm">{formatDate(transaction.dueDate)}</span>
                            </td>
                            <td className="py-3 px-4">
                              {isOverdue(transaction) ? (
                                <Badge variant="destructive" className="flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  Overdue
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Active
                                </Badge>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <DeleteTransactionDialog
                                  transaction={transaction}
                                  trigger={
                                    <Button variant="ghost" size="sm">
                                      <BookCheck className="h-4 w-4" />
                                    </Button>
                                  }
                                  onSuccess={fetchAllTransactions}
                                />
                                <Button variant="ghost" size="sm">
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 