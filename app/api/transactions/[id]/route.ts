import { NextRequest, NextResponse } from 'next/server';
import { getTransaction, deleteTransaction } from '@/app/lib/api/transactions';

// GET /api/transactions/[id] - Get a specific transaction
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const transactionId = parseInt(params.id);
    if (isNaN(transactionId)) {
      return NextResponse.json(
        { title: 'Invalid transaction ID', detail: 'Transaction ID must be a number' },
        { status: 400 }
      );
    }
    
    const transaction = await getTransaction(transactionId);
    return NextResponse.json({ transaction });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(error, { status: error.status || 500 });
  }
}

// DELETE /api/transactions/[id] - Delete a specific transaction
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const transactionId = parseInt(params.id);
    if (isNaN(transactionId)) {
      return NextResponse.json(
        { title: 'Invalid transaction ID', detail: 'Transaction ID must be a number' },
        { status: 400 }
      );
    }
    
    const result = await deleteTransaction(transactionId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(error, { status: error.status || 500 });
  }
} 