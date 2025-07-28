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
import { Search, BookOpen, UserPlus, LogOut, Settings, HelpCircle } from "lucide-react";
import { useState } from "react";

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState("loans");

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">
                  +12 from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
                <Badge variant="destructive" className="h-4 w-4 rounded-full p-0 text-xs">!</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
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
                <div className="text-2xl font-bold">1,243</div>
                <p className="text-xs text-muted-foreground">
                  Ready for checkout
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Members</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">
                  This week
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Workspace */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Library Management</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant={activeTab === "loans" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab("loans")}
                  >
                    Active Loans
                  </Button>
                  <Button
                    variant={activeTab === "overdue" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab("overdue")}
                  >
                    Overdue
                  </Button>
                  <Button
                    variant={activeTab === "books" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab("books")}
                  >
                    All Books
                  </Button>
                  <Button
                    variant={activeTab === "members" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab("members")}
                  >
                    All Members
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {activeTab === "loans" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input placeholder="Search active loans..." className="max-w-sm" />
                    <Button variant="outline" size="sm">Filter</Button>
                  </div>
                  <div className="text-center py-8 text-muted-foreground">
                    Active loans table will be implemented here
                  </div>
                </div>
              )}
              {activeTab === "overdue" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input placeholder="Search overdue books..." className="max-w-sm" />
                    <Button variant="outline" size="sm">Filter</Button>
                  </div>
                  <div className="text-center py-8 text-muted-foreground">
                    Overdue books table will be implemented here
                  </div>
                </div>
              )}
              {activeTab === "books" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input placeholder="Search all books..." className="max-w-sm" />
                    <Button variant="outline" size="sm">Filter</Button>
                  </div>
                  <div className="text-center py-8 text-muted-foreground">
                    All books table will be implemented here
                  </div>
                </div>
              )}
              {activeTab === "members" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input placeholder="Search members..." className="max-w-sm" />
                    <Button variant="outline" size="sm">Filter</Button>
                  </div>
                  <div className="text-center py-8 text-muted-foreground">
                    Members table will be implemented here
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
} 