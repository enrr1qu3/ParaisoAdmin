export interface IBinnacleParams {
    search?: string;
    dateFrom?: string; // ISO UTC
    dateTo?: string;   // ISO UTC
    pageNumber?: number;
    pageSize?: number;
}

export interface IBinnacleResponse {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    items: IBinnacle[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export interface IBinnacle {
    id: number;
    nameUser: string;
    nameTask: string;
    createdDate: string | null;
}
