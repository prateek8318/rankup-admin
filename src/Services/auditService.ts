import BaseApiService from './baseApi';
import API_CONFIG from './apiConfig';

class AuditService extends BaseApiService {
  async getLogs() {
    return this.get(API_CONFIG.ENDPOINTS.AUDIT.LOGS);
  }
}

export default new AuditService();
