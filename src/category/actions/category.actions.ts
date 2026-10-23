import { paraisoAdminApi } from "../../api/paraisoAdminApi";
import type { ICategory, ICategoryParams, ICategoryRequest, ICategoryResponse } from "../interfaces/category.interface";

export const categoryAction = async (params: ICategoryParams): Promise<ICategoryResponse> => {
    const response = await paraisoAdminApi.get('/categories', { params });
    return response.data;
};

export const getCategoryByIdAction = async (id: number): Promise<ICategory> => {
    const response = await paraisoAdminApi.get(`/categories/${id}`);
    return response.data;
};

export const createCategoryAction = async (body: ICategoryRequest): Promise<ICategory> => {
    const response = await paraisoAdminApi.post('/categories', body);
    return response.data;
};

export const updateCategoryAction = async (id: number, body: ICategoryRequest): Promise<ICategory> => {
    const response = await paraisoAdminApi.put(`/categories/${id}`, body);
    return response.data;
};

// 409 si la categoría tiene subsecciones activas
export const deleteCategoryAction = async (id: number): Promise<boolean> => {
    const response = await paraisoAdminApi.delete(`/categories/${id}`);
    return response.data;
};
