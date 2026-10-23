import type { User } from "../../interfaces/user.interface";

export interface IUsersParams {
    pageNumber?: number;
    pageSize?: number;
}

// Body de POST /identity/register
export interface IRegisterRequest {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    paternalLastName: string;
    maternalLastName: string | null;
    phoneNumber: string | null;
}

export interface IUsersResponse {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    items: User[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}
