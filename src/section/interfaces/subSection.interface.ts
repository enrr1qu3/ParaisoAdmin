import type { ISubSection } from "./section.interface";

// La API acepta el semestre como número: 1 Anual, 2 Semestral, 3 Trimestral
export type Semester = 1 | 2 | 3;

export const SEMESTER_OPTIONS: { value: Semester; label: string }[] = [
    { value: 1, label: 'Anual' },
    { value: 2, label: 'Semestral' },
    { value: 3, label: 'Trimestral' },
];

export interface ISubSectionParams {
    search?: string;
    sectionId?: number;
    categoryId?: number;
    semester?: Semester;
    dateFrom?: string; // yyyy-MM-dd
    dateTo?: string;   // yyyy-MM-dd
    pageNumber?: number;
    pageSize?: number;
}

// Body de POST y PUT /subsections. En PUT los opcionales que no se envíen quedan en null
export interface ISubSectionRequest {
    nameSubSection: string;
    sectionId: number;
    semester?: Semester | null;
    date?: string | null; // yyyy-MM-dd
    categoryId?: number | null;
}

export interface ISubSectionResponse {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    items: ISubSection[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}
