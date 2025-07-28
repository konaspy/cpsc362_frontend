import { z } from 'zod';
import { PositiveInteger, NonEmptyString } from './common';

// Core Member schema for database entities
export const MemberSchema = z.object({
  memberID: PositiveInteger,
  firstName: NonEmptyString,
  lastName: NonEmptyString,
  email: z.email()
});

// Inferred TypeScript type
export type Member = z.infer<typeof MemberSchema>;

// Schema for creating new members (no memberID)
export const CreateMemberSchema = MemberSchema.omit({ memberID: true }).extend({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

// Schema for updating members (all fields optional except memberID)
export const UpdateMemberSchema = MemberSchema.partial().omit({ memberID: true });

// Inferred types for requests
export type CreateMemberRequest = z.infer<typeof CreateMemberSchema>;
export type UpdateMemberRequest = z.infer<typeof UpdateMemberSchema>;

// Optional: Class wrapper if you need methods
export class MemberModel {
  static schema = MemberSchema;

  constructor(private readonly props: Member) {}

  // Accept already-validated data
  static wrap(data: Member): MemberModel {
    return new MemberModel(data);
  }

  // Optional: convenience method for parsing + wrapping
  static parse(raw: unknown): MemberModel {
    return MemberModel.wrap(MemberSchema.parse(raw));
  }

  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  toJSON(): Member {
    return this.props;
  }
} 