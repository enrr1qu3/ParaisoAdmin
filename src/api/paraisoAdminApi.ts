import axios, { type InternalAxiosRequestConfig } from 'axios';
import { refreshTokenAction } from '../auth/actions/login.actions';
import { useAuthStore } from '../auth/store/auth.store';

const paraisoAdminApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

paraisoAdminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Un solo refresh a la vez: si llegan varios 401 juntos (p. ej. StrictMode), todos esperan el mismo.
let refreshing: Promise<void> | null = null;

const refreshTokens = async () => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!token || !refreshToken) throw new Error('No hay sesión');

    try {
        const data = await refreshTokenAction(token, refreshToken);
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
    } catch (error) {
        // Limpia también el store para que las rutas protegidas manden al login
        useAuthStore.getState().logout();
        throw error;
    }
};

paraisoAdminApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        const isAuthCall = original?.url?.startsWith('/identity/login') || original?.url?.startsWith('/identity/refresh-token');

        // Sin token no hay nada que refrescar ni reintentar
        if (error.response?.status !== 401 || !original || original._retry || isAuthCall || !localStorage.getItem('token')) {
            return Promise.reject(error);
        }

        original._retry = true;
        // Si otro 401 ya renovó el token mientras esta petición viajaba, basta con reintentar
        const sentToken = String(original.headers.Authorization ?? '').replace('Bearer ', '');
        if (sentToken === localStorage.getItem('token')) {
            refreshing ??= refreshTokens().finally(() => { refreshing = null; });
            await refreshing;
        }
        // El interceptor de request pone el token nuevo
        return paraisoAdminApi(original);
    }
);

export { paraisoAdminApi };
