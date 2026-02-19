/**
 * Legacy API config - re-exports from apiEndpoints + apiClient for backward compatibility
 */
import { appConfig } from '@/core/config/appConfig';
import { apiEndpoints } from './apiEndpoints';
import apiClient from './apiClient';

export const API_CONFIG = {
  BASE_URL: appConfig.apiBaseUrl,
  USER_SERVICE_URL: appConfig.userServiceUrl,
  DASHBOARD_SERVICE_URL: '',
  ENDPOINTS: apiEndpoints,
} as const;

export const axiosInstance = apiClient;
export default API_CONFIG;
