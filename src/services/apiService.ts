import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { errorHandlingService, ApiError } from './errorHandlingService';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.rankupadmin.com';

// Create Axios instance with default configuration
const createApiInstance = (): AxiosInstance => {
  const instance = Axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add request timestamp for debugging
      config.metadata = { startTime: new Date() };

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      // Calculate request duration
      const endTime = new Date();
      const duration = endTime.getTime() - (response.config.metadata?.startTime?.getTime() || 0);
      
      // Log successful requests in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`API Success: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
      }

      return response;
    },
    (error) => {
      // Handle errors globally
      const apiError = errorHandlingService.handleError(error);
      
      // Handle specific error cases
      if (apiError.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      } else if (apiError.status === 403) {
        // Insufficient permissions
        console.warn('Access forbidden: insufficient permissions');
      }

      return Promise.reject(apiError);
    }
  );

  return instance;
};

// API Service class
export class ApiService {
  private static instance: ApiService;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = createApiInstance();
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // HTTP Methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  // File upload
  async upload<T>(url: string, file: File, config?: AxiosRequestConfig): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const uploadConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
      onUploadProgress: config?.onUploadProgress,
    };

    const response = await this.axiosInstance.post<T>(url, formData, uploadConfig);
    return response.data;
  }

  // Download file
  async download(url: string, filename?: string): Promise<void> {
    const response = await this.axiosInstance.get(url, {
      responseType: 'blob',
    });

    // Create download link
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  // Cancel request
  createCancelToken(): () => void {
    const cancelTokenSource = Axios.CancelToken.source();
    return () => cancelTokenSource.cancel('Request cancelled by user');
  }

  // Set auth token
  setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
  }

  // Remove auth token
  removeAuthToken(): void {
    localStorage.removeItem('authToken');
    delete this.axiosInstance.defaults.headers.Authorization;
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }
}

// Export singleton instance
export const apiService = ApiService.getInstance();

// Export types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request metadata for timing
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime: Date;
    };
  }
}
