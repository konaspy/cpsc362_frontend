import { NextRequest, NextResponse } from 'next/server';
import { getTransaction, deleteTransaction } from '@/app/lib/api/transactions';
import { PositiveInteger } from '@/app/lib/schemas';

// GET /api/transactions/[id] - Get a specific transaction
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const transactionId = PositiveInteger.parse(parseInt(params.id));
    const transaction = await getTransaction(transactionId);
    return NextResponse.json({ transaction });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(error, { status: (error as any)?.status || 500 });
  }
}

// DELETE /api/transactions/[id] - Delete a specific transaction
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const transactionId = PositiveInteger.parse(parseInt(params.id));
    const result = await deleteTransaction(transactionId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(error, { status: (error as any)?.status || 500 });
  }
} 