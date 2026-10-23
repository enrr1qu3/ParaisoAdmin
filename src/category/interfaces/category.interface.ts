import type { ISubSection } from "../../section/interfaces/section.interface";

export interface ICategoryParams {
    search?: string;
    pageNumber?: number;
    pageSize?: number;
}

// Body de POST y PUT /categories
export interface ICategoryRequest {
    nameCategory: string; // máx. 100 caracteres
}

// La API puede mandar las fechas en null
export interface ICategory {
    createdDate: string | null;
    id: number;
    nameCategory: string;
    subSections: ISubSection[];
    updatedDate: string | null;
}

export interface ICategoryResponse {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    items: ICategory[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}
