import { NextRequest, NextResponse } from 'next/server';
import { getBook, updateBook, deleteBook } from '@/app/lib/api/books';
import { UpdateBookSchema, PositiveInteger } from '@/app/lib/schemas';

// GET /api/books/[id] - Get a specific book
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bookId = PositiveInteger.parse(parseInt(params.id));
    const book = await getBook(bookId);
    return NextResponse.json({ book });
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json(error, { status: (error as any)?.status || 500 });
  }
}

// PUT /api/books/[id] - Update a specific book
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bookId = PositiveInteger.parse(parseInt(params.id));
    const body = await req.json();
    const bookData = UpdateBookSchema.parse(body);
    const book = await updateBook(bookId, bookData);
    return NextResponse.json({ book });
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json(error, { status: (error as any)?.status || 500 });
  }
}

// DELETE /api/books/[id] - Delete a specific book
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bookId = PositiveInteger.parse(parseInt(params.id));
    const result = await deleteBook(bookId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(error, { status: (error as any)?.status || 500 });
  }
} 