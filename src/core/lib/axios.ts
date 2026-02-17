/**
 * Base Axios instance (no auth interceptors - use apiClient for that)
 */
import axios from 'axios';
import { appConfig } from '@/core/config/appConfig';

export const axiosBase = axios.create({
  baseURL: appConfig.apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  },
  timeout: appConfig.requestTimeout,
});
