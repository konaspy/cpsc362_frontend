import { BookModel, CreateBookRequest, UpdateBookRequest, type Book } from '../schemas';

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
    return list.map((book: unknown) => BookModel.fromJSON(book).toJSON());
}

export async function getBook(bookId: number): Promise<Book> {
    const url = new URL(`${BOOKS_URL}/${bookId}`);
    const response = await fetch(url);
    
    if (!response.ok) {
        throw await response.json();
    }
    
    const data = await response.json();
    console.log(data);
    return BookModel.fromJSON(data.data?.book).toJSON();
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
    return BookModel.fromJSON(data.data?.book).toJSON();
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
    return BookModel.fromJSON(data.data?.book).toJSON();
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