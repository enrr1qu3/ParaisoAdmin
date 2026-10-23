// import type { User } from "@/interfaces/user.interface";

export interface AuthResponse {
    email: string;
    refreshToken: string;
    roles: string[];
    token: string;
    tokenExpiration: string; // ISO, llega como texto en el JSON
    userId: string;
}
