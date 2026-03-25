import API_CONFIG from './apiConfig';
import { appConfig } from './appConfig';
import { errorHandlingService } from '@/services/errorHandlingService';
import axios, { AxiosError, AxiosInstance } from 'axios';

class SubscriptionService {
  private subscriptionClient: AxiosInstance;

  constructor() {
    // Use the specific subscription service port 56925
    this.subscriptionClient = axios.create({
      baseURL: appConfig.services.subscriptionPlans,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: appConfig.requestTimeout,
      withCredentials: false,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for auth
    this.subscriptionClient.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.subscriptionClient.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (!error.config?.skipGlobalErrorHandler) {
          errorHandlingService.handleError(error, error.config?.url);
        }
        return Promise.reject(error);
      }
    );
  }

  private async request(endpoint: string, options: { method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; data?: unknown } = {}) {
    const response = await this.subscriptionClient.request({
      url: endpoint,
      method: options.method ?? 'GET',
      data: options.data,
    });
    return response.data;
  }

  async get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint: string, data?: unknown) {
    return this.request(endpoint, { method: 'POST', data });
  }

  async put(endpoint: string, data?: unknown) {
    return this.request(endpoint, { method: 'PUT', data });
  }

  async delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  }
  // Plan Management
  async getAllPlans() {
    return this.get(API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.PLANS.GET_ALL);
  }

  async getPlanById(id: string) {
    return this.get(API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.PLANS.GET_BY_ID(id));
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

  async togglePopular(id: string) {
    return this.post(API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.PLANS.TOGGLE_POPULAR(id));
  }

  async toggleRecommended(id: string) {
    return this.post(API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.PLANS.TOGGLE_RECOMMENDED(id));
  }

  async toggleStatus(id: string) {
    return this.post(API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.PLANS.TOGGLE_STATUS(id));
  }

  async getPlanStats() {
    return this.get(API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.PLANS.GET_STATS);
  }

  async getFilteredPlans(params: any) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString 
      ? `${API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.PLANS.GET_FILTERED}?${queryString}`
      : API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.PLANS.GET_FILTERED;
    return this.get(endpoint);
  }

  async getActivePlans() {
    return this.get(API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.PLANS.GET_ACTIVE);
  }

  // User Subscription Management
  async createUserSubscription(data: any) {
    return this.post(API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.USER_SUBSCRIPTIONS.CREATE, data);
  }

  async getMySubscription() {
    return this.get(API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.USER_SUBSCRIPTIONS.GET_MY_SUBSCRIPTION);
  }

  async getSubscriptionHistory() {
    return this.get(API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.USER_SUBSCRIPTIONS.GET_HISTORY);
  }

  async activateSubscription(data: any) {
    return this.post(API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.USER_SUBSCRIPTIONS.ACTIVATE, data);
  }

  async cancelSubscription(data: any) {
    return this.post(API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.USER_SUBSCRIPTIONS.CANCEL, data);
  }

  async renewSubscription(data: any) {
    return this.post(API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.USER_SUBSCRIPTIONS.RENEW, data);
  }

  async deleteUserSubscription(id: string) {
    return this.delete(API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.USER_SUBSCRIPTIONS.DELETE(id));
  }
}

export default new SubscriptionService();

