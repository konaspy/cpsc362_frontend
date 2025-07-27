// Main data model interfaces moved to /models directory with runtime validation
// These types remain for API request/response bodies and utility types

export interface ProblemDetails {
    type: string;
    title: string;
    status: number;
    detail: string;
    data?: any;
    "invalid-params"?: string[];
}

// Request types for creating/updating resources
export interface CreateMemberRequest {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
}

export interface UpdateMemberRequest {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
}

export interface CreateBookRequest {
    isbn: string;
    bookName: string;
    authorName: string;
}

export interface UpdateBookRequest {
    isbn?: string;
    bookName?: string;
    authorName?: string;
}

export interface CreateTransactionRequest {
    bookID: number;
    memberID: number;
} 