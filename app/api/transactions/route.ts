import { NextRequest, NextResponse } from 'next/server';
import { getTransactions, createTransaction } from '@/app/lib/api/transactions';
import { CreateTransactionSchema } from '@/app/lib/schemas';

// GET /api/transactions - List all transactions with optional search
// GET /api/transactions?bookID=1&memberID=2 - Search transactions
export async function GET(req: NextRequest) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const transactions = await getTransactions(searchParams);
    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(error, { status: (error as any)?.status || 500 });
  }
}

// POST /api/transactions - Create a new transaction (checkout/checkin)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const transactionData = CreateTransactionSchema.parse(body);
    const transaction = await createTransaction(transactionData);
    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(error, { status: (error as any)?.status || 500 });
  }
} 