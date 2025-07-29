"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import StaffSidebar from "@/components/staff/StaffSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookDown, Search, ArrowLeft } from "lucide-react";
import { getTransactions } from "@/app/lib/api/transactions";
import { DeleteTransactionDialog } from "@/components/dialogs/transactionDialogs";
import type { Transaction } from "@/app/lib/schemas/transaction";

export default function ReturnBook() {
  const router = useRouter();
  const [transactionId, setTransactionId] = useState("");
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!transactionId.trim()) {
      setError("Please enter a transaction ID");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const searchParams = new URLSearchParams();
      searchParams.append('transactionID', transactionId.trim());
      
      const transactions = await getTransactions(searchParams);
      
      if (transactions.length === 0) {
        setError("No active transaction found with this ID");
        setTransaction(null);
      } else {
        setTransaction(transactions[0]);
        setError("");
      }
    } catch (err) {
      console.error('Error searching transaction:', err);
      setError("Error searching for transaction");
      setTransaction(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnSuccess = () => {
    // Navigate back to transactions list after successful return
    router.push("/staff/transactions");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <SidebarProvider>
      <StaffSidebar />
      
      <SidebarInset>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <BookDown className="h-6 w-6" />
            <h1 className="text-2xl font-semibold">Return Book</h1>
          </div>
          <Button 
            variant="outline" 
            onClick={() => router.push("/staff/transactions")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Transactions
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Find Transaction to Return</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="transactionId">Transaction ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="transactionId"
                    placeholder="Enter transaction ID..."
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSearch}
                    disabled={loading || !transactionId.trim()}
                    className="flex items-center gap-2"
                  >
                    <Search className="h-4 w-4" />
                    {loading ? "Searching..." : "Search"}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              {transaction && (
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Transaction Found</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Transaction ID:</span>
                        <div className="font-mono">{transaction.transactionID}</div>
                      </div>
                      <div>
                        <span className="font-medium">Book ID:</span>
                        <div className="font-mono">{transaction.bookID}</div>
                      </div>
                      <div>
                        <span className="font-medium">Member ID:</span>
                        <div className="font-mono">{transaction.memberID}</div>
                      </div>
                      <div>
                        <span className="font-medium">Due Date:</span>
                        <div>{new Date(transaction.dueDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <DeleteTransactionDialog
                        transaction={transaction}
                        trigger={
                          <Button className="w-full">
                            <BookDown className="h-4 w-4 mr-2" />
                            Return This Book
                          </Button>
                        }
                        onSuccess={handleReturnSuccess}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 