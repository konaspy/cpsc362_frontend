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
import { Search, BookOpen, LogOut, Settings, HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useReportCounts } from "@/hooks/use-report-counts";
import { useReportData } from "@/hooks/use-report-data";
import { ReportType } from "@/app/lib/api";

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
          <div className="flex h-16 items-center px-6">
            {/* Sidebar Trigger for mobile */}
            <SidebarTrigger className="md:hidden" />

            {/* Global Search */}
            <div className="flex-1 max-w-md mx-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search books, members..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/avatars/staff.png" alt="Staff" />
                      <AvatarFallback>ST</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">Sarah Thompson</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      s.thompson@library.org
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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