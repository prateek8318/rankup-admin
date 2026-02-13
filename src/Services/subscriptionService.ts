import BaseApiService from './baseApi';
import API_CONFIG from './apiConfig';

class SubscriptionService extends BaseApiService {
  async getAllPlans() {
    return this.get(API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.PLANS.GET_ALL);
  }

  async createPlan(data: any) {
    return this.post(API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.PLANS.CREATE, data);
  }

  async updatePlan(id: string, data: any) {
    return this.put(API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.PLANS.UPDATE(id), data);
  }

  async deletePlan(id: string) {
    return this.delete(API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.PLANS.DELETE(id));
  }
}

export default new SubscriptionService();
