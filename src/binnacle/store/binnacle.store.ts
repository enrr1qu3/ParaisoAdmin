import { create } from 'zustand';
import { isAxiosError } from 'axios';
import { binnacleAction } from '../actions/binnacle.actions';
import type { IBinnacleParams, IBinnacleResponse } from '../interfaces/binnacle.interface';

type BinnacleState = {
    binnacle: IBinnacleResponse;
    // Últimos filtros usados, para que la paginación conserve búsqueda y fechas
    params: IBinnacleParams;
    loading: boolean;
    error: string | null;

    binnacleRequest: (params: IBinnacleParams) => Promise<void>;
}

export const useBinnacleStore = create<BinnacleState>()((set) => ({
    binnacle: {
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

    binnacleRequest: async (params: IBinnacleParams) => {
        set({ loading: true, error: null, params });
        try {
            const data = await binnacleAction(params);
            set({ binnacle: data });
        } catch (error) {
            const forbidden = isAxiosError(error) && error.response?.status === 403;
            set({ error: forbidden ? 'No tienes permiso para ver la bitácora' : 'No se pudo cargar la bitácora' });
        } finally {
            set({ loading: false });
        }
    },
}));
