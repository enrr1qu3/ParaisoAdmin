import { paraisoAdminApi } from "../../api/paraisoAdminApi";
import type { ISection, ISectionParams, ISectionRequest, ISectionResponse } from "../interfaces/section.interface";

export const sectionAction = async (params: ISectionParams): Promise<ISectionResponse> => {
    const response = await paraisoAdminApi.get('/sections', { params });
    return response.data;
};

export const getSectionByIdAction = async (id: number): Promise<ISection> => {
    const response = await paraisoAdminApi.get(`/sections/${id}`);
    return response.data;
};

export const createSectionAction = async (body: ISectionRequest): Promise<ISection> => {
    const response = await paraisoAdminApi.post('/sections', body);
    return response.data;
};

export const updateSectionAction = async (id: number, body: ISectionRequest): Promise<ISection> => {
    const response = await paraisoAdminApi.put(`/sections/${id}`, body);
    return response.data;
};

// 409 si la sección tiene subsecciones activas
export const deleteSectionAction = async (id: number): Promise<boolean> => {
    const response = await paraisoAdminApi.delete(`/sections/${id}`);
    return response.data;
};
