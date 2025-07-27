import { NextRequest, NextResponse } from 'next/server';
import { getMember, updateMember, deleteMember } from '@/app/lib/api/members';
import type { UpdateMemberRequest } from '@/app/lib/types';

// GET /api/members/[id] - Get a specific member
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const memberId = parseInt(params.id);
    if (isNaN(memberId)) {
      return NextResponse.json(
        { title: 'Invalid member ID', detail: 'Member ID must be a number' },
        { status: 400 }
      );
    }
    
    const member = await getMember(memberId);
    return NextResponse.json({ member });
  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json(error, { status: error.status || 500 });
  }
}

// PUT /api/members/[id] - Update a specific member
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const memberId = parseInt(params.id);
    if (isNaN(memberId)) {
      return NextResponse.json(
        { title: 'Invalid member ID', detail: 'Member ID must be a number' },
        { status: 400 }
      );
    }
    
    const memberData: UpdateMemberRequest = await req.json();
    const member = await updateMember(memberId, memberData);
    return NextResponse.json({ member });
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json(error, { status: error.status || 500 });
  }
}

// DELETE /api/members/[id] - Delete a specific member
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const memberId = parseInt(params.id);
    if (isNaN(memberId)) {
      return NextResponse.json(
        { title: 'Invalid member ID', detail: 'Member ID must be a number' },
        { status: 400 }
      );
    }
    
    const result = await deleteMember(memberId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(error, { status: error.status || 500 });
  }
} 