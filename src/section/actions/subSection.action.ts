import { paraisoAdminApi } from "../../api/paraisoAdminApi";
import type { ISubSection } from "../interfaces/section.interface";
import type { ISubSectionParams, ISubSectionRequest, ISubSectionResponse } from "../interfaces/subSection.interface";

// Para el drawer basta con filtrar por sectionId
export const subSectionAction = async (params: ISubSectionParams): Promise<ISubSectionResponse> => {
    const response = await paraisoAdminApi.get('/subsections', { params });
    return response.data;
};

export const getSubSectionByIdAction = async (id: number): Promise<ISubSection> => {
    const response = await paraisoAdminApi.get(`/subsections/${id}`);
    return response.data;
};

export const createSubSectionAction = async (body: ISubSectionRequest): Promise<ISubSection> => {
    const response = await paraisoAdminApi.post('/subsections', body);
    return response.data;
};

export const updateSubSectionAction = async (id: number, body: ISubSectionRequest): Promise<ISubSection> => {
    const response = await paraisoAdminApi.put(`/subsections/${id}`, body);
    return response.data;
};

// 409 si la subsección tiene documentos activos
export const deleteSubSectionAction = async (id: number): Promise<boolean> => {
    const response = await paraisoAdminApi.delete(`/subsections/${id}`);
    return response.data;
};
