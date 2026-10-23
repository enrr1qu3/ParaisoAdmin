import { create } from 'zustand';
import { createSectionAction, deleteSectionAction, sectionAction, updateSectionAction } from '../actions/section.actions';
import type { ISectionParams, ISectionRequest, ISectionResponse } from '../interfaces/section.interface';

type SectionState = {
    sections: ISectionResponse;
    // Últimos filtros usados, para que paginación y refetch conserven la búsqueda
    params: ISectionParams;
    loading: boolean;
    error: string | null;

    sectionRequest: (params: ISectionParams) => Promise<void>;
    createSection: (body: ISectionRequest) => Promise<void>;
    updateSection: (id: number, body: ISectionRequest) => Promise<void>;
    deleteSection: (id: number) => Promise<void>;
}

export const useSectionStore = create<SectionState>()((set, get) => ({
    sections: {
        items: [],
        pageNumber: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        pageSize: 12,
        totalCount: 0,
        totalPages: 0
    },
    params: { pageNumber: 1, pageSize: 12 },
    loading: false,
    error: null,

    sectionRequest: async (params: ISectionParams) => {
        set({ loading: true, error: null, params });
        try {
            const data = await sectionAction(params);
            set({ sections: data });
        } catch (error) {
            // console.error('Error fetching sections', error);
            set({ error: 'No se pudieron cargar las secciones' });
        } finally {
            set({ loading: false });
        }
    },

    // Lanza el error para que el componente muestre la notificación
    createSection: async (body: ISectionRequest) => {
        await createSectionAction(body);
        await get().sectionRequest(get().params);
    },

    updateSection: async (id: number, body: ISectionRequest) => {
        await updateSectionAction(id, body);
        await get().sectionRequest(get().params);
    },

    deleteSection: async (id: number) => {
        await deleteSectionAction(id);
        const { pageNumber, items } = get().sections;
        // Si era el último de la página, retrocede una para no quedar en una página vacía
        const page = items.length === 1 && pageNumber > 1 ? pageNumber - 1 : pageNumber;
        await get().sectionRequest({ ...get().params, pageNumber: page });
    },
}));
