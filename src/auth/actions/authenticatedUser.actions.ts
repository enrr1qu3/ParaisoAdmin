import { paraisoAdminApi } from '../../api/paraisoAdminApi';
import type { User } from '../../interfaces/user.interface';

export const authenticatedUserAction = async (): Promise<User> => {
    const response = await paraisoAdminApi.get('/identity/profile');
    return response.data;
};
