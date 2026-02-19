import BaseApiService from '@/core/api/baseApi';
import API_CONFIG from '@/core/api/apiConfig';

class ExportService extends BaseApiService {
  async exportUsers() {
    return this.get(API_CONFIG.ENDPOINTS.EXPORTS.USERS);
  }

  async exportExams() {
    return this.get(API_CONFIG.ENDPOINTS.EXPORTS.EXAMS);
  }

  async exportSubscriptions() {
    return this.get(API_CONFIG.ENDPOINTS.EXPORTS.SUBSCRIPTIONS);
  }
}

export default new ExportService();
