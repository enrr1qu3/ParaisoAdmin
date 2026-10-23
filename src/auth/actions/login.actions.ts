import { paraisoAdminApi } from '../../api/paraisoAdminApi';
import type { AuthResponse } from "../interfaces/login.action";

export const loginAction = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await paraisoAdminApi.post('/identity/login', { email, password });
    return response.data;
};

export const refreshTokenAction = async (token: string, refreshToken: string): Promise<AuthResponse> => {
    const response = await paraisoAdminApi.post('/identity/refresh-token', { token, refreshToken });
    return response.data;
};
