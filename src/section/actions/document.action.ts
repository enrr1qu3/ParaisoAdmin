import axios from "axios";
import { paraisoAdminApi } from "../../api/paraisoAdminApi";
import type { ISectionDocument } from "../interfaces/section.interface";
import type { IDocumentParams, IDocumentRequest, IDocumentResponse, IDocumentUploadUrlResponse } from "../interfaces/document.interface";

type OnProgress = (percent: number) => void;

// Sube el archivo directo a Blob Storage (evita el límite de 230 s de App Service) y devuelve su blobName
const uploadToBlob = async (file: File, onProgress?: OnProgress) => {
    const { data } = await paraisoAdminApi.post<IDocumentUploadUrlResponse>('/documents/upload-url', { fileName: file.name, size: file.size });
    // axios directo, no paraisoAdminApi: Blob rechaza la petición si llega el Bearer junto al SAS
    await axios.put(data.uploadUrl, file, {
        headers: {
            'x-ms-blob-type': 'BlockBlob',
            'x-ms-tags': new URLSearchParams(data.tags).toString(),
            'Content-Type': file.type || 'application/octet-stream',
        },
        onUploadProgress: (e) => onProgress?.(Math.round((e.progress ?? 0) * 100)),
    });
    return data.blobName;
};

export const documentAction = async (params: IDocumentParams): Promise<IDocumentResponse> => {
    const response = await paraisoAdminApi.get('/documents', { params });
    return response.data;
};

export const getDocumentByIdAction = async (id: number): Promise<ISectionDocument> => {
    const response = await paraisoAdminApi.get(`/documents/${id}`);
    return response.data;
};

export const createDocumentAction = async ({ file, numSemester = null, year = null, subSectionId }: IDocumentRequest, onProgress?: OnProgress): Promise<ISectionDocument> => {
    if (!file) throw new Error('Falta el archivo');
    const blobName = await uploadToBlob(file, onProgress);
    const response = await paraisoAdminApi.post('/documents', { blobName, numSemester, year, subSectionId, fileName: file.name });
    return response.data;
};

export const updateDocumentAction = async (id: number, { file, numSemester = null, year = null, subSectionId }: IDocumentRequest, onProgress?: OnProgress): Promise<ISectionDocument> => {
    // Sin archivo nuevo se manda blobName null y el backend conserva el actual
    const blobName = file ? await uploadToBlob(file, onProgress) : null;
    const response = await paraisoAdminApi.put(`/documents/${id}`, { blobName, numSemester, year, subSectionId });
    return response.data;
};

// Soft delete: el backend también borra el archivo de Blob Storage
export const deleteDocumentAction = async (id: number): Promise<boolean> => {
    const response = await paraisoAdminApi.delete(`/documents/${id}`);
    return response.data;
};
