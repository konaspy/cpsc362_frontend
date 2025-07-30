"use client";

import { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import MemberSidebar from "@/components/member/MemberSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, User, X } from "lucide-react";
import { type Book } from "@/app/lib/schemas";
import { getBooks } from "@/app/lib/api/books";
import { useReportCounts } from "@/hooks/use-report-counts";
import { getMember } from "@/app/lib/api/members";
import { Member } from "@/app/lib/schemas/member";

export default function MemberBookSearchPage() {
  // Book list and loading state
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Search form state
  const [searchForm, setSearchForm] = useState({
    bookID: "",
    bookName: "",
    authorName: "",
    isbn: "",
  });

  // Member info for sidebar
  const [memberInfo, setMemberInfo] = useState<Member | null>(null);

  // Stats – reuse the same reports the staff page shows
  const {
    loading: cardLoading,
    error: cardError,
    counts,
  } = useReportCounts({
    total: "books",
    available: "books-available",
  });

  // Fetch logged-in member details (for sidebar display)
  useEffect(() => {
    async function fetchMember() {
      try {
        const storedID = Number(localStorage.getItem("token") || "0");
        if (!storedID) return;
        const data = await getMember(storedID);
        setMemberInfo(data);
      } catch (err) {
        console.error("Failed to load member info:", err);
      }
    }

    fetchMember();
  }, []);

  // Fetch all books (initial load & clear)
  const fetchAllBooks = async () => {
    try {
      setLoading(true);
      const booksList = await getBooks();
      setBooks(booksList);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAllBooks();
  }, []);

  // Handle search submit
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      setLoading(true);
      const searchParams = new URLSearchParams();
      if (searchForm.bookID) searchParams.append("bookID", searchForm.bookID);
      if (searchForm.bookName) searchParams.append("bookName", searchForm.bookName);
      if (searchForm.authorName) searchParams.append("authorName", searchForm.authorName);
      if (searchForm.isbn) searchParams.append("isbn", searchForm.isbn);

      const data = await getBooks(searchParams);
      setBooks(data);
    } catch (error) {
      console.error("Error searching books:", error);
    } finally {
      setLoading(false);
    }
  };

  // Clear search inputs & reload
  const handleClear = () => {
    setSearchForm({ bookID: "", bookName: "", authorName: "", isbn: "" });
    fetchAllBooks();
  };

  return (
    <SidebarProvider>
      {/* Sidebar */}
      <MemberSidebar
        memberInfo={
          memberInfo || {
            memberID: 0,
            firstName: "",
            lastName: "",
            email: "",
          }
        }
      />

      <SidebarInset>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <h1 className="text-2xl font-semibold">Book Search</h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Books</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cardLoading ? "..." : cardError ? "—" : counts.total ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">In catalog</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Books</CardTitle>
              <Badge variant="outline" className="h-4 w-4 rounded-full p-0 text-xs">
                ✓
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cardLoading ? "..." : cardError ? "—" : counts.available ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">Ready for checkout</p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Results */}
        <div className="p-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Search Books</CardTitle>
                <form onSubmit={handleSearch} className="flex items-center space-x-2">
                  <Input
                    placeholder="Search by ID..."
                    value={searchForm.bookID}
                    onChange={(e) =>
                      setSearchForm((prev) => ({ ...prev, bookID: e.target.value }))
                    }
                    className="w-32"
                  />
                  <Input
                    placeholder="Book title..."
                    value={searchForm.bookName}
                    onChange={(e) =>
                      setSearchForm((prev) => ({ ...prev, bookName: e.target.value }))
                    }
                    className="w-36"
                  />
                  <Input
                    placeholder="Author name..."
                    value={searchForm.authorName}
                    onChange={(e) =>
                      setSearchForm((prev) => ({ ...prev, authorName: e.target.value }))
                    }
                    className="w-36"
                  />
                  <Input
                    placeholder="Search by ISBN..."
                    value={searchForm.isbn}
                    onChange={(e) =>
                      setSearchForm((prev) => ({ ...prev, isbn: e.target.value }))
                    }
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
                    disabled={
                      !searchForm.bookID &&
                      !searchForm.bookName &&
                      !searchForm.authorName &&
                      !searchForm.isbn
                    }
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
                  Loading books...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">ID</th>
                        <th className="text-left py-3 px-4 font-medium">Title</th>
                        <th className="text-left py-3 px-4 font-medium">Author</th>
                        <th className="text-left py-3 px-4 font-medium">ISBN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center py-8 text-muted-foreground"
                          >
                            {searchForm.bookID ||
                            searchForm.bookName ||
                            searchForm.authorName ||
                            searchForm.isbn
                              ? "No books found matching your search."
                              : "No books found."}
                          </td>
                        </tr>
                      ) : (
                        books.map((book) => (
                          <tr
                            key={book.bookID}
                            className="border-b hover:bg-muted/50"
                          >
                            <td className="py-3 px-4">
                              <span className="font-mono text-sm">{book.bookID}</span>
                            </td>
                            <td className="py-3 px-4 font-medium">{book.bookName}</td>
                            <td className="py-3 px-4 flex items-center space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{book.authorName}</span>
                            </td>
                            <td className="py-3 px-4 font-mono text-sm">{book.isbn}</td>
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

