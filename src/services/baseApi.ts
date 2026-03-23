/**
 * Generic GET, POST, PUT, DELETE helpers + BaseApiService class for legacy services.
 * Auth and global error handling are delegated to the shared Axios client.
 */
import apiClient from './apiClient';
import API_CONFIG from './apiConfig';
import { createApiClient } from './axios';

export async function get<T = unknown>(endpoint: string): Promise<T> {
  const response = await apiClient.get<T>(endpoint);
  return response.data;
}

export async function post<T = unknown>(endpoint: string, body?: unknown): Promise<T> {
  const response = await apiClient.post<T>(endpoint, body);
  return response.data;
}

export async function put<T = unknown>(endpoint: string, body?: unknown): Promise<T> {
  const response = await apiClient.put<T>(endpoint, body);
  return response.data;
}

export async function del<T = unknown>(endpoint: string): Promise<T> {
  const response = await apiClient.delete<T>(endpoint);
  return response.data;
}

class BaseApiService {
  protected client = createApiClient(API_CONFIG.BASE_URL);

  protected async request(endpoint: string, options: { method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'; data?: unknown } = {}): Promise<unknown> {
    const response = await this.client.request({
      url: endpoint,
      method: options.method ?? 'GET',
      data: options.data,
    });
    return response.data;
  }

  async get(endpoint: string): Promise<unknown> {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint: string, data?: unknown): Promise<unknown> {
    return this.request(endpoint, { method: 'POST', data });
  }

  async put(endpoint: string, data?: unknown): Promise<unknown> {
    return this.request(endpoint, { method: 'PUT', data });
  }

  async delete(endpoint: string): Promise<unknown> {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export default BaseApiService;
