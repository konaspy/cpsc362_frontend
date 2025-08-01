import { NextRequest, NextResponse } from 'next/server';
import { getBooks, createBook } from '@/app/lib/api/books';
import { CreateBookSchema } from '@/app/lib/schemas';

// GET /api/books - List all books with optional search
// GET /api/books?isbn=123&bookName=title&authorName=author - Search books
export async function GET(req: NextRequest) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const books = await getBooks(searchParams);
    return NextResponse.json({ books });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(error, { status: (error as any)?.status || 500 });
  }
}

// POST /api/books - Create a new book
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const bookData = CreateBookSchema.parse(body);
    const book = await createBook(bookData);
    return NextResponse.json({ book }, { status: 201 });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(error, { status: (error as any)?.status || 500 });
  }
} 