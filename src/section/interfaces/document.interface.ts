import type { ISectionDocument } from "./section.interface";

export interface IDocumentParams {
    subSectionId?: number;
    numSemester?: number; // 1-4
    year?: number;
    pageNumber?: number;
    pageSize?: number;
}

// Se envía como multipart/form-data. En PUT file es opcional y, si viene, reemplaza al actual
export interface IDocumentRequest {
    numSemester?: number | null; // opcional, 1-4
    year?: number | null;        // opcional, solo el año
    subSectionId: number;
    file?: File;
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

export const MAX_DOCUMENT_SIZE_MB = 500;
