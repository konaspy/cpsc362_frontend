"use client";

import { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import StaffSidebar from "@/components/staff/StaffSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Search, Pencil, Trash, Users, Mail, IdCard, BookOpen, X } from "lucide-react";
import { type Member } from "@/app/lib/schemas";
import { getMembers } from "@/app/lib/api/members";
import { AddMemberDialog, EditMemberDialogWrapper } from "@/components/dialogs/memberDialogs";
import { useReportCounts } from "@/hooks/use-report-counts";
import { EditMemberByIdDialog } from "@/components/dialogs/MemberLookupEdit";

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchForm, setSearchForm] = useState({
    memberID: "",
    firstName: "",
    lastName: "",
    email: ""
  });

  const { loading: cardLoading, error: cardError, counts } = useReportCounts({
    total: "members",
    borrowing: "members-borrowing",
    overdue: "members-overdue",
    booksBorrowed: "transactions",
  });

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    try {
      setLoading(true); 
      
      const searchParams = new URLSearchParams();
      if (searchForm.memberID) searchParams.append('memberID', searchForm.memberID);
      if (searchForm.firstName) searchParams.append('firstName', searchForm.firstName);
      if (searchForm.lastName) searchParams.append('lastName', searchForm.lastName);
      if (searchForm.email) searchParams.append('email', searchForm.email);
      
      const data = await getMembers(searchParams);
      setMembers(data);
    } catch (error) {
      console.error('Error searching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchForm({ memberID: "", firstName: "", lastName: "", email: "" });
    // Reload all members when clearing
    fetchAllMembers();
  };

  const fetchAllMembers = async () => {
    try {
      setLoading(true);
      const membersList = await getMembers();
      setMembers(membersList);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMembers();
  }, []);

  // Since we're doing server-side search, we don't need client-side filtering
  const filteredMembers = members;

  return (
    <SidebarProvider>
      <StaffSidebar />
      
      <SidebarInset>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6" />
            <h1 className="text-2xl font-semibold">Members</h1>
          </div>
          <div className="flex gap-2">
            <AddMemberDialog
              trigger={
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              }
              onSuccess={fetchAllMembers}
            />
            <EditMemberByIdDialog
              trigger={
                <Button variant="outline">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Member
                </Button>
              }
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cardLoading ? "..." : cardError ? "—" : counts.total ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Active library members
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Borrowing Members</CardTitle>
              <Badge variant="outline" className="h-4 w-4 rounded-full p-0 text-xs">!</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cardLoading ? "..." : cardError ? "—" : counts.borrowing ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently borrowing books
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Members</CardTitle>
              <Badge variant="destructive" className="h-4 w-4 rounded-full p-0">!</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cardLoading ? "..." : cardError ? "—" : counts.overdue ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Need to return books
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Books Borrowed</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cardLoading ? "..." : cardError ? "—" : counts.booksBorrowed ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Total books borrowed by members
              </p>
            </CardContent>
          </Card>

        </div>

        {/* Search and Table */}
        <div className="p-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Search Members</CardTitle>
                <form onSubmit={handleSearch} className="flex items-center space-x-2">
                  <Input
                    placeholder="Search by ID..."
                    value={searchForm.memberID}
                    onChange={(e) => setSearchForm(prev => ({ ...prev, memberID: e.target.value }))}
                    className="w-32"
                  />
                  <Input
                    placeholder="First name..."
                    value={searchForm.firstName}
                    onChange={(e) => setSearchForm(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-36"
                  />
                  <Input
                    placeholder="Last name..."
                    value={searchForm.lastName}
                    onChange={(e) => setSearchForm(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-36"
                  />
                  <Input
                    placeholder="Search by email..."
                    value={searchForm.email}
                    onChange={(e) => setSearchForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-48"
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
                    disabled={!searchForm.memberID && !searchForm.firstName && !searchForm.lastName && !searchForm.email}
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
                  Loading members...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">ID</th>
                        <th className="text-left py-3 px-4 font-medium">Name</th>
                        <th className="text-left py-3 px-4 font-medium">Email</th>
                        <th className="text-left py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center py-8 text-muted-foreground">
                            {(searchForm.memberID || searchForm.firstName || searchForm.lastName || searchForm.email) ? 'No members found matching your search.' : 'No members found.'}
                          </td>
                        </tr>
                      ) : (
                        filteredMembers.map((member) => (
                          <tr key={member.memberID} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-sm">{member.memberID}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium">
                                {member.firstName} {member.lastName}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{member.email}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <EditMemberDialogWrapper
                                  member={member}
                                  trigger={
                                    <Button variant="ghost" size="sm">
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  }
                                  onSuccess={fetchAllMembers}
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