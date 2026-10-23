import type { Semester } from "./subSection.interface";

export interface ISectionParams {
    search?: string;
    userId?: string;
    pageNumber?: number;
    pageSize?: number;
}

// Body de POST y PUT /sections
export interface ISectionRequest {
    nameSection: string;
}

export interface ISectionResponse {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    items: ISection[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

// Las fechas llegan como string ISO (axios no las convierte) y pueden venir en null
export interface ISection {
    createdDate: string | null;
    id: number;
    nameSection: string;
    subSections: ISubSection[];
    updatedDate: string | null;
    userId: string;
}

export interface ISubSection {
    categoryId: number | null;
    createdDate: string | null;
    date: string | null;
    documents: ISectionDocument[];
    id: number;
    nameSubSection: string;
    sectionId: number;
    semester: Semester | null;
    updatedDate: string | null;
}

export interface ISectionDocument {
    createdDate: string | null;
    filePathUrl: string;
    id: number;
    numSemester: number | null;
    year: number | null;
    subSectionId: number;
    updatedDate: string | null;
}
