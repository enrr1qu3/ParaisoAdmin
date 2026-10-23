import { create } from 'zustand';
import { isAxiosError } from 'axios';
import { createUserAction, usersAction } from '../actions/users.actions';
import type { IRegisterRequest, IUsersParams, IUsersResponse } from '../interfaces/users.interface';

type UsersState = {
    users: IUsersResponse;
    params: IUsersParams;
    loading: boolean;
    error: string | null;

    usersRequest: (params: IUsersParams) => Promise<void>;
    createUser: (body: IRegisterRequest) => Promise<void>;
}

export const useUsersStore = create<UsersState>()((set, get) => ({
    users: {
        items: [],
        pageNumber: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0
    },
    params: { pageNumber: 1, pageSize: 10 },
    loading: false,
    error: null,

    usersRequest: async (params: IUsersParams) => {
        set({ loading: true, error: null, params });
        try {
            const data = await usersAction(params);
            set({ users: data });
        } catch (error) {
            const forbidden = isAxiosError(error) && error.response?.status === 403;
            set({ error: forbidden ? 'No tienes permiso para ver los usuarios' : 'No se pudieron cargar los usuarios' });
        } finally {
            set({ loading: false });
        }
    },

    // Lanza el error para que el componente muestre la notificación
    createUser: async (body: IRegisterRequest) => {
        await createUserAction(body);
        await get().usersRequest(get().params);
    },
}));
