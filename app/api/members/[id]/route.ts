import { NextRequest, NextResponse } from 'next/server';
import { getMember, updateMember, deleteMember } from '@/app/lib/api/members';
import { UpdateMemberSchema, PositiveInteger } from '@/app/lib/schemas';

// GET /api/members/[id] - Get a specific member
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const memberId = PositiveInteger.parse(parseInt(params.id));
    const member = await getMember(memberId);
    return NextResponse.json({ member });
  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json(error, { status: (error as any)?.status || 500 });
  }
}

// PUT /api/members/[id] - Update a specific member
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const memberId = PositiveInteger.parse(parseInt(params.id));
    const body = await req.json();
    const memberData = UpdateMemberSchema.parse(body);
    const member = await updateMember(memberId, memberData);
    return NextResponse.json({ member });
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json(error, { status: (error as any)?.status || 500 });
  }
}

// DELETE /api/members/[id] - Delete a specific member
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const memberId = PositiveInteger.parse(parseInt(params.id));
    const result = await deleteMember(memberId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(error, { status: (error as any)?.status || 500 });
  }
} 