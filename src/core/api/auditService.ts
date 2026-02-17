import BaseApiService from '@/core/api/baseApi';
import API_CONFIG from '@/core/api/apiConfig';

class AuditService extends BaseApiService {
  async getLogs() {
    return this.get(API_CONFIG.ENDPOINTS.AUDIT.LOGS);
  }
}

export default new AuditService();
