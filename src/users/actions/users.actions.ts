import { paraisoAdminApi } from "../../api/paraisoAdminApi";
import type { User } from "../../interfaces/user.interface";
import type { IRegisterRequest, IUsersParams, IUsersResponse } from "../interfaces/users.interface";

// Requiere rol SuperAdmin o Admin (403 si no)
export const usersAction = async (params: IUsersParams): Promise<IUsersResponse> => {
    const response = await paraisoAdminApi.get('/identity/users', { params });
    return response.data;
};

// 409 si el email ya existe
export const createUserAction = async (body: IRegisterRequest): Promise<User> => {
    const response = await paraisoAdminApi.post('/identity/register', body);
    return response.data;
};
