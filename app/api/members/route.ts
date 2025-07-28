import { NextRequest, NextResponse } from 'next/server';
import { getMembers, getMember, createMember, updateMember, deleteMember } from '@/app/lib/api/members';
import { CreateMemberSchema } from '@/app/lib/schemas';

// GET /api/members - List all members with optional search
// GET /api/members?firstName=John&lastName=Doe - Search members
export async function GET(req: NextRequest) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const members = await getMembers(searchParams);
    return NextResponse.json({ members });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(error, { status: (error as any)?.status || 500 });
  }
}

// POST /api/members - Create a new member
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const memberData = CreateMemberSchema.parse(body);
    const member = await createMember(memberData);
    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json(error, { status: (error as any)?.status || 500 });
  }
} 