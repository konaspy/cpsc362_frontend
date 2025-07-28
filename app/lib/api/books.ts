import { BookSchema, CreateBookRequest, UpdateBookRequest, type Book } from '../schemas';
import { z } from 'zod';

const BASE_URL = process.env.BACKEND_URL || "http://127.0.0.1:80";
const BOOKS_URL = `${BASE_URL}/api/books`;

export async function getBooks(query?: URLSearchParams): Promise<Book[]> {
    const url = new URL(BOOKS_URL);
    if (query) {
        // Append each search parameter from the query
        query.forEach((value, key) => {
            url.searchParams.set(key, value);
        });
    }
    
    const response = await fetch(url);
    if (!response.ok) {
        throw await response.json();
    }
    
    const data = await response.json();
    console.log(data);
    const list = data.data?.books || [];
    return z.array(BookSchema).parse(list);
}

export async function getBook(bookId: number): Promise<Book> {
    const url = new URL(`${BOOKS_URL}/${bookId}`);
    const response = await fetch(url);
    
    if (!response.ok) {
        throw await response.json();
    }
    
    const data = await response.json();
    console.log(data);
    return BookSchema.parse(data.data?.book);
}

export async function createBook(bookData: CreateBookRequest): Promise<Book> {
    const response = await fetch(BOOKS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
    });
    
    if (!response.ok) {
        throw await response.json();
    }
    
    const data = await response.json();
    console.log(data);
    return BookSchema.parse(data.data?.book);
}

export async function updateBook(bookId: number, bookData: UpdateBookRequest): Promise<Book> {
    const response = await fetch(`${BOOKS_URL}/${bookId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
    });
    
    if (!response.ok) {
        throw await response.json();
    }
    
    const data = await response.json();
    console.log(data);
    return BookSchema.parse(data.data?.book);
}

export async function deleteBook(bookId: number): Promise<{ message: string }> {
    const response = await fetch(`${BOOKS_URL}/${bookId}`, {
        method: 'DELETE',
    });
    
    if (!response.ok) {
        throw await response.json();
    }
    
    const data = await response.json();
    console.log(data);
    return data;
} 