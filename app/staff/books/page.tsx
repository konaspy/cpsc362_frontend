"use client";

import { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import StaffSidebar from "@/components/staff/StaffSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookPlus, Search, Pencil, Trash, BookOpen, Library, X, User } from "lucide-react";
import { type Book } from "@/app/lib/schemas";
import { getBooks } from "@/app/lib/api/books";
import { AddBookDialog, EditBookDialogWrapper } from "@/components/dialogs/bookDialogs";
import { useReportCounts } from "@/hooks/use-report-counts";
import { EditBookByIdDialog } from "@/components/dialogs/BookLookupEdit";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchForm, setSearchForm] = useState({
    bookID: "",
    bookName: "",
    authorName: "",
    isbn: ""
  });

  const { loading: cardLoading, error: cardError, counts } = useReportCounts({
    total: "books",
    available: "books-available",
    overdue: "books-overdue",
    borrowed: "transactions",
  });

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    try {
      setLoading(true); 
      
      const searchParams = new URLSearchParams();
      if (searchForm.bookID) searchParams.append('bookID', searchForm.bookID);
      if (searchForm.bookName) searchParams.append('bookName', searchForm.bookName);
      if (searchForm.authorName) searchParams.append('authorName', searchForm.authorName);
      if (searchForm.isbn) searchParams.append('isbn', searchForm.isbn);
      
      const data = await getBooks(searchParams);
      setBooks(data);
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchForm({ bookID: "", bookName: "", authorName: "", isbn: "" });
    // Reload all books when clearing
    fetchAllBooks();
  };

  const fetchAllBooks = async () => {
    try {
      setLoading(true);
      const booksList = await getBooks();
      setBooks(booksList);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBooks();
  }, []);

  // Since we're doing server-side search, we don't need client-side filtering
  const filteredBooks = books;

  return (
    <SidebarProvider>
      <StaffSidebar />
      
      <SidebarInset>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <h1 className="text-2xl font-semibold">Books</h1>
          </div>
          <div className="flex gap-2">
            <AddBookDialog
              trigger={
                <Button>
                  <BookPlus className="h-4 w-4 mr-2" />
                  Add Book
                </Button>
              }
              onSuccess={fetchAllBooks}
            />
            <EditBookByIdDialog
              trigger={
                <Button variant="outline">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Book
                </Button>
              }
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Books</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cardLoading ? "..." : cardError ? "—" : counts.total ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Books in library catalog
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Books</CardTitle>
              <Badge variant="outline" className="h-4 w-4 rounded-full p-0 text-xs">✓</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cardLoading ? "..." : cardError ? "—" : counts.available ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Ready for checkout
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
              <Badge variant="destructive" className="h-4 w-4 rounded-full p-0">!</Badge>
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Books Borrowed</CardTitle>
              <Library className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cardLoading ? "..." : cardError ? "—" : counts.borrowed ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently checked out
              </p>
            </CardContent>
          </Card>

        </div>

        {/* Search and Table */}
        <div className="p-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Search Books</CardTitle>
                <form onSubmit={handleSearch} className="flex items-center space-x-2">
                  <Input
                    placeholder="Search by ID..."
                    value={searchForm.bookID}
                    onChange={(e) => setSearchForm(prev => ({ ...prev, bookID: e.target.value }))}
                    className="w-32"
                  />
                  <Input
                    placeholder="Book title..."
                    value={searchForm.bookName}
                    onChange={(e) => setSearchForm(prev => ({ ...prev, bookName: e.target.value }))}
                    className="w-36"
                  />
                  <Input
                    placeholder="Author name..."
                    value={searchForm.authorName}
                    onChange={(e) => setSearchForm(prev => ({ ...prev, authorName: e.target.value }))}
                    className="w-36"
                  />
                  <Input
                    placeholder="Search by ISBN..."
                    value={searchForm.isbn}
                    onChange={(e) => setSearchForm(prev => ({ ...prev, isbn: e.target.value }))}
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
                    disabled={!searchForm.bookID && !searchForm.bookName && !searchForm.authorName && !searchForm.isbn}
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
                        <th className="text-left py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBooks.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-muted-foreground">
                            {(searchForm.bookID || searchForm.bookName || searchForm.authorName || searchForm.isbn) ? 'No books found matching your search.' : 'No books found.'}
                          </td>
                        </tr>
                      ) : (
                        filteredBooks.map((book) => (
                          <tr key={book.bookID} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-sm">{book.bookID}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium">
                                {book.bookName}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{book.authorName}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-mono text-sm">{book.isbn}</span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <EditBookDialogWrapper
                                  book={book}
                                  trigger={
                                    <Button variant="ghost" size="sm">
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  }
                                  onSuccess={fetchAllBooks}
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