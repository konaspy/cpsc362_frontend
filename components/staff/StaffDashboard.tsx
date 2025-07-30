"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import StaffSidebar from "./StaffSidebar";
import { ReportTable } from "./ReportTables";
import { Search, BookOpen, LogOut, Settings, HelpCircle, ChevronDown, Receipt, Home } from "lucide-react";
import { useState } from "react";
import { useReportCounts } from "@/hooks/use-report-counts";
import { useReportData } from "@/hooks/use-report-data";
import { ReportType } from "@/app/lib/api";
import { useRouter } from "next/navigation";

const REPORT_OPTIONS = [
  { value: "transactions" as ReportType, label: "All Transactions" },
  { value: "transactions-overdue" as ReportType, label: "Overdue Transactions" },
  { value: "transactions-compliant" as ReportType, label: "Compliant Transactions" },
  { value: "members" as ReportType, label: "All Members" },
  { value: "members-overdue" as ReportType, label: "Members with Overdue Books" },
  { value: "members-borrowing" as ReportType, label: "Members Currently Borrowing" },
  { value: "books" as ReportType, label: "All Books" },
  { value: "books-overdue" as ReportType, label: "Books Currently Overdue" },
  { value: "books-available" as ReportType, label: "Books Available for Borrowing" },
  { value: "overdue-summary" as ReportType, label: "Overdue Summary Report" },
  { value: "borrowing-summary" as ReportType, label: "Borrowing Summary Report" },
];

export default function StaffDashboard() {
  const [selectedReport, setSelectedReport] = useState<ReportType>("transactions");
  const router = useRouter();
  const { loading, error, counts } = useReportCounts({
    activeLoans: "transactions",
    overdueBooks: "books-overdue", 
    availableBooks: "books-available",
  });

  // Fetch data for the selected report
  const reportData = useReportData(selectedReport);

  const selectedReportLabel = REPORT_OPTIONS.find(option => option.value === selectedReport)?.label || "Select Report";

  return (
    <SidebarProvider>
      <StaffSidebar />

      <SidebarInset>
        {/* Top Navigation */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-2">
              <Home className="h-6 w-6" />
              <h1 className="text-2xl font-semibold">Staff Dashboard</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-red-500 text-white hover:bg-red-600" onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                router.push('/');
              }}>
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
                  {loading ? "..." : error ? "—" : counts.activeLoans ?? 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Current transactions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
                <Badge variant="destructive" className="h-4 w-4 rounded-full p-0 text-xs">!</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "..." : error ? "—" : counts.overdueBooks ?? 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Require attention
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Books</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "..." : error ? "—" : counts.availableBooks ?? 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Ready for checkout
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Workspace */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Library Reports</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-64">
                      {selectedReportLabel}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64">
                    {REPORT_OPTIONS.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => setSelectedReport(option.value)}
                        className={selectedReport === option.value ? "bg-accent" : ""}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <ReportTable
                data={reportData.data}
                loading={reportData.loading}
                error={reportData.error}
                reportType={selectedReport}
              />
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
} 