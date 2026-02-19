/**
 * Base Axios instance (no auth interceptors - use apiClient for that)
 */
import axios from 'axios';
import { appConfig } from '@/core/config/appConfig';

export const axiosBase = axios.create({
  baseURL: appConfig.apiBaseUrl,
  withCredentials: false, // Disable credentials to avoid CORS issues
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: appConfig.requestTimeout,
});
