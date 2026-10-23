import { create } from 'zustand';
import { loginAction } from '../actions/login.actions';
import type { User } from '../../interfaces/user.interface';
import { authenticatedUserAction } from '../actions/authenticatedUser.actions';

type AuthStatus = 'authenticated' | 'not-authenticated' | 'checking';


type AuthState = {
    // Properties
    user: User | null;
    // Los tokens viven solo en localStorage (el interceptor los renueva ahí)
    authStatus: AuthStatus;

    // Getters
    // isAdmin: () => boolean;

    // Actions
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    userProfile: () => Promise<void>;
    // checkAuthStatus: () => Promise<boolean>

};

export const useAuthStore = create<AuthState>()((set, get) => ({
    // Implementación del Store
    user: null,
    authStatus: 'checking',

    // Getters
    // isAdmin: () => {
    //     // return !!get().user?.roles.includes('admin');
    //     const roles = get().user?.roles || [];
    //     return roles.includes('admin');
    // },

    // Actions
    login: async (email: string, password: string) => {
        try {
            const data = await loginAction(email, password);
            localStorage.setItem('token', data.token);
            localStorage.setItem('refreshToken', data.refreshToken);
            await get().userProfile();
            return get().authStatus === 'authenticated';
        } catch {
            get().logout();
            return false;
        };
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        set({ user: null, authStatus: 'not-authenticated' });
    },

    userProfile: async () => {
        try {
            const data = await authenticatedUserAction();
            set({ user: data, authStatus: 'authenticated' });
        } catch {
            get().logout();
        }
    }
}));