import BaseApiService from '@/core/api/baseApi';
import API_CONFIG from '@/core/api/apiConfig';

class DashboardService extends BaseApiService {
  async getOverview() {
    return this.get(API_CONFIG.ENDPOINTS.DASHBOARD.OVERVIEW);
  }

  async getStats() {
    return this.get(API_CONFIG.ENDPOINTS.DASHBOARD.STATS);
  }
}

export default new DashboardService();
