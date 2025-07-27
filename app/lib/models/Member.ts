export interface MemberProps {
  memberID: number;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Runtime-validated Member model.
 * Use Member.fromJSON(raw) whenever you receive untrusted JSON.
 * Throws a descriptive error if the JSON is not a valid Member.
 */
export class Member implements MemberProps {
  constructor(
    public memberID: number,
    public firstName: string,
    public lastName: string,
    public email: string
  ) {}

  /** Factory that validates JSON and returns a Member instance */
  static fromJSON(raw: unknown): Member {
    if (!Member.isValid(raw)) {
      throw new Error('Invalid Member JSON: missing or invalid required fields');
    }
    const data = raw as MemberProps;
    return new Member(data.memberID, data.firstName, data.lastName, data.email);
  }

  /** Narrowing type-guard: returns true iff raw satisfies MemberProps */
  static isValid(raw: unknown): raw is MemberProps {
    return !!raw &&
      typeof (raw as any).memberID === 'number' &&
      typeof (raw as any).firstName === 'string' &&
      typeof (raw as any).lastName === 'string' &&
      typeof (raw as any).email === 'string';
  }
} 