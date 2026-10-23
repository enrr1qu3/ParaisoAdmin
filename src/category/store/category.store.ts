import { create } from 'zustand';
import { isAxiosError } from 'axios';
import { categoryAction, createCategoryAction, deleteCategoryAction, updateCategoryAction } from '../actions/category.actions';
import type { ICategoryParams, ICategoryRequest, ICategoryResponse } from '../interfaces/category.interface';

type CategoryState = {
    categories: ICategoryResponse;
    // Últimos filtros usados, para que paginación y refetch conserven la búsqueda
    params: ICategoryParams;
    loading: boolean;
    error: string | null;

    categoryRequest: (params: ICategoryParams) => Promise<void>;
    createCategory: (body: ICategoryRequest) => Promise<void>;
    updateCategory: (id: number, body: ICategoryRequest) => Promise<void>;
    deleteCategory: (id: number) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>()((set, get) => ({
    categories: {
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

    categoryRequest: async (params: ICategoryParams) => {
        set({ loading: true, error: null, params });
        try {
            const data = await categoryAction(params);
            set({ categories: data });
        } catch (error) {
            const forbidden = isAxiosError(error) && error.response?.status === 403;
            set({ error: forbidden ? 'No tienes permiso para ver las categorías' : 'No se pudieron cargar las categorías' });
        } finally {
            set({ loading: false });
        }
    },

    // Lanzan el error para que el componente muestre la notificación
    createCategory: async (body: ICategoryRequest) => {
        await createCategoryAction(body);
        await get().categoryRequest(get().params);
    },

    updateCategory: async (id: number, body: ICategoryRequest) => {
        await updateCategoryAction(id, body);
        await get().categoryRequest(get().params);
    },

    deleteCategory: async (id: number) => {
        await deleteCategoryAction(id);
        const { pageNumber, items } = get().categories;
        // Si era el último de la página, retrocede una para no quedar en una página vacía
        const page = items.length === 1 && pageNumber > 1 ? pageNumber - 1 : pageNumber;
        await get().categoryRequest({ ...get().params, pageNumber: page });
    },
}));
