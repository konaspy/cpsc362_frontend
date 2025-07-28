import { TransactionSchema, CreateTransactionRequest, type Transaction } from '../schemas';
import { z } from 'zod';

const BASE_URL = process.env.BACKEND_URL || "http://127.0.0.1:80";
const TRANSACTIONS_URL = `${BASE_URL}/api/transactions`;

export async function getTransactions(query?: URLSearchParams): Promise<Transaction[]> {
    const url = new URL(TRANSACTIONS_URL);
    if (query) {
        // Append each search parameter from the query (bookID, memberID)
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
    const list = data.data?.transactions || [];
    return z.array(TransactionSchema).parse(list);
}

export async function getTransaction(transactionId: number): Promise<Transaction> {
    const url = new URL(`${TRANSACTIONS_URL}/${transactionId}`);
    const response = await fetch(url);
    
    if (!response.ok) {
        throw await response.json();
    }
    
    const data = await response.json();
    console.log(data);
    return TransactionSchema.parse(data.data?.transaction);
}

export async function createTransaction(transactionData: CreateTransactionRequest): Promise<Transaction> {
    const response = await fetch(TRANSACTIONS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
    });
    
    if (!response.ok) {
        throw await response.json();
    }
    
    const data = await response.json();
    console.log(data);
    return TransactionSchema.parse(data.data?.transaction);
}

export async function deleteTransaction(transactionId: number): Promise<{ message: string }> {
    const response = await fetch(`${TRANSACTIONS_URL}/${transactionId}`, {
        method: 'DELETE',
    });
    
    if (!response.ok) {
        throw await response.json();
    }
    
    const data = await response.json();
    console.log(data);
    return data;
} 