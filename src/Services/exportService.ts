import BaseApiService from './baseApi';
import API_CONFIG from './apiConfig';

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
