import BaseApiService from '@/core/api/baseApi';
import API_CONFIG from '@/core/api/apiConfig';

class ExamService extends BaseApiService {
  async getAllExams() {
    return this.get(API_CONFIG.ENDPOINTS.EXAMS.GET_ALL);
  }

  async createExam(data: any) {
    return this.post(API_CONFIG.ENDPOINTS.EXAMS.CREATE, data);
  }

  async updateExam(id: string, data: any) {
    return this.put(API_CONFIG.ENDPOINTS.EXAMS.UPDATE(id), data);
  }

  async deleteExam(id: string) {
    return this.delete(API_CONFIG.ENDPOINTS.EXAMS.DELETE(id));
  }
}

export default new ExamService();
