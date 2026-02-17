import BaseApiService from '@/core/api/baseApi';
import API_CONFIG from '@/core/api/apiConfig';

class UserService extends BaseApiService {
  async getAllUsers(params?: any) {
    return this.get(API_CONFIG.ENDPOINTS.USERS.GET_ALL);
  }

  async updateUser(id: string, data: any) {
    return this.put(API_CONFIG.ENDPOINTS.USERS.UPDATE(id), data);
  }

  async enableDisableUser(id: string) {
    return this.post(API_CONFIG.ENDPOINTS.USERS.ENABLE_DISABLE(id));
  }
}

export default new UserService();
