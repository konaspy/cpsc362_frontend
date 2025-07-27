import { NextRequest, NextResponse } from 'next/server';
import { getBook, updateBook, deleteBook } from '@/app/lib/api/books';
import type { UpdateBookRequest } from '@/app/lib/types';

// GET /api/books/[id] - Get a specific book
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bookId = parseInt(params.id);
    if (isNaN(bookId)) {
      return NextResponse.json(
        { title: 'Invalid book ID', detail: 'Book ID must be a number' },
        { status: 400 }
      );
    }
    
    const book = await getBook(bookId);
    return NextResponse.json({ book });
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json(error, { status: error.status || 500 });
  }
}

// PUT /api/books/[id] - Update a specific book
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bookId = parseInt(params.id);
    if (isNaN(bookId)) {
      return NextResponse.json(
        { title: 'Invalid book ID', detail: 'Book ID must be a number' },
        { status: 400 }
      );
    }
    
    const bookData: UpdateBookRequest = await req.json();
    const book = await updateBook(bookId, bookData);
    return NextResponse.json({ book });
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json(error, { status: error.status || 500 });
  }
}

// DELETE /api/books/[id] - Delete a specific book
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bookId = parseInt(params.id);
    if (isNaN(bookId)) {
      return NextResponse.json(
        { title: 'Invalid book ID', detail: 'Book ID must be a number' },
        { status: 400 }
      );
    }
    
    const result = await deleteBook(bookId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(error, { status: error.status || 500 });
  }
} 