import { paraisoAdminApi } from "../../api/paraisoAdminApi";
import type { ISectionDocument } from "../interfaces/section.interface";
import type { IDocumentParams, IDocumentRequest, IDocumentResponse } from "../interfaces/document.interface";

// Los nombres de campo van en PascalCase porque así los espera el backend en el multipart
const toFormData = ({ numSemester, year, subSectionId, file }: IDocumentRequest) => {
    const formData = new FormData();
    // Vacío = null en el backend (int?), así al editar se puede quitar el semestre o el año
    formData.append('NumSemester', numSemester == null ? '' : String(numSemester));
    formData.append('Year', year == null ? '' : String(year));
    formData.append('SubSectionId', String(subSectionId));
    if (file) formData.append('file', file);
    return formData;
};

export const documentAction = async (params: IDocumentParams): Promise<IDocumentResponse> => {
    const response = await paraisoAdminApi.get('/documents', { params });
    return response.data;
};

export const getDocumentByIdAction = async (id: number): Promise<ISectionDocument> => {
    const response = await paraisoAdminApi.get(`/documents/${id}`);
    return response.data;
};

export const createDocumentAction = async (body: IDocumentRequest): Promise<ISectionDocument> => {
    const response = await paraisoAdminApi.post('/documents', toFormData(body));
    return response.data;
};

export const updateDocumentAction = async (id: number, body: IDocumentRequest): Promise<ISectionDocument> => {
    const response = await paraisoAdminApi.put(`/documents/${id}`, toFormData(body));
    return response.data;
};

// Soft delete: el archivo se conserva en Blob Storage
export const deleteDocumentAction = async (id: number): Promise<boolean> => {
    const response = await paraisoAdminApi.delete(`/documents/${id}`);
    return response.data;
};
