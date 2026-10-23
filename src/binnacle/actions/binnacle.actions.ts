import { paraisoAdminApi } from "../../api/paraisoAdminApi";
import type { IBinnacleParams, IBinnacleResponse } from "../interfaces/binnacle.interface";

// Requiere rol SuperAdmin o Admin (403 si no). Del más reciente al más antiguo.
export const binnacleAction = async (params: IBinnacleParams): Promise<IBinnacleResponse> => {
    const response = await paraisoAdminApi.get('/binnacles', { params });
    return response.data;
};
