import { MemberSchema, CreateMemberRequest, UpdateMemberRequest, type Member } from '../schemas';
import { z } from 'zod';

const BASE_URL = process.env.BACKEND_URL || "http://127.0.0.1:80";
const M_URL = `${BASE_URL}/api/members`;

export async function getMembers(query?: URLSearchParams): Promise<Member[]> {
    const url = new URL(M_URL);
    if (query) {
        // Append each search parameter from the query (firstName, lastName, email, username)
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
    const list = data.data?.members || [];
    return z.array(MemberSchema).parse(list);
}

export async function getMember(memberId: number): Promise<Member> {
    const url = new URL(`${M_URL}/${memberId}`);
    const response = await fetch(url);
    
    if (!response.ok) {
        throw await response.json();
    }
    
    const data = await response.json();
    console.log(data);
    return MemberSchema.parse(data.data?.member || data);
}

export async function createMember(memberData: CreateMemberRequest): Promise<Member> {
    const response = await fetch(M_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
    });
    
    if (!response.ok) {
        throw await response.json();
    }
    
    const data = await response.json();
    console.log(data);
    return MemberSchema.parse(data.data?.member);
}

export async function updateMember(memberId: number, memberData: UpdateMemberRequest): Promise<Member> {
    const response = await fetch(`${M_URL}/${memberId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
    });
    
    if (!response.ok) {
        throw await response.json();
    }
    
    const data = await response.json();
    console.log(data);
    return MemberSchema.parse(data.data?.member);
}

export async function deleteMember(memberId: number): Promise<{ message: string }> {
    const response = await fetch(`${M_URL}/${memberId}`, {
        method: 'DELETE',
    });
    
    if (!response.ok) {
        throw await response.json();
    }
    
    const data = await response.json();
    console.log(data);
    return data;
} 