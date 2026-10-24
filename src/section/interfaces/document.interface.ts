import type { ISectionDocument } from "./section.interface";

export interface IDocumentParams {
    subSectionId?: number;
    numSemester?: number; // 1-4
    year?: number;
    pageNumber?: number;
    pageSize?: number;
}

// El archivo se sube directo a Blob; al backend solo viaja el blobName. En PUT file es opcional y, si viene, reemplaza al actual
export interface IDocumentRequest {
    numSemester?: number | null; // opcional, 1-4
    year?: number | null;        // opcional, solo el año
    subSectionId: number;
    file?: File;
}

export interface IDocumentUploadUrlResponse {
    blobName: string;
    uploadUrl: string; // SAS de solo escritura, válido 2 horas
    expiresOn: string;
    tags: Record<string, string>;
}

export interface IDocumentResponse {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    items: ISectionDocument[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export const DOCUMENT_SEMESTER_OPTIONS = [1, 2, 3, 4].map((n) => ({ value: n, label: `Semestre ${n}` }));

export const MAX_DOCUMENT_SIZE_MB = 600;
