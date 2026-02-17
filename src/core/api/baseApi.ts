/**
 * Generic GET, POST, PUT, DELETE (fetch-based) + BaseApiService class for legacy services
 */
import { appConfig } from '@/core/config/appConfig';

const baseURL = appConfig.apiBaseUrl;

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function get<T = unknown>(endpoint: string): Promise<T> {
  const res = await fetch(`${baseURL}${endpoint}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { message?: string }).message || `HTTP ${res.status}`);
  return data as T;
}

export async function post<T = unknown>(endpoint: string, body?: unknown): Promise<T> {
  const res = await fetch(`${baseURL}${endpoint}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { message?: string }).message || `HTTP ${res.status}`);
  return data as T;
}

export async function put<T = unknown>(endpoint: string, body?: unknown): Promise<T> {
  const res = await fetch(`${baseURL}${endpoint}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { message?: string }).message || `HTTP ${res.status}`);
  return data as T;
}

export async function del<T = unknown>(endpoint: string): Promise<T> {
  const res = await fetch(`${baseURL}${endpoint}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { message?: string }).message || `HTTP ${res.status}`);
  return data as T;
}

/** Legacy: class-based service (use get/post/put/del or apiClient for new code) */
import API_CONFIG from './apiConfig';

class BaseApiService {
  protected baseURL = API_CONFIG.BASE_URL;

  protected async request(endpoint: string, options: RequestInit = {}): Promise<unknown> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: getAuthHeaders() as HeadersInit,
      ...options,
    };
    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) throw new Error((data as { message?: string }).message || `HTTP ${response.status}`);
    return data;
  }

  async get(endpoint: string): Promise<unknown> {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint: string, data?: unknown): Promise<unknown> {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put(endpoint: string, data?: unknown): Promise<unknown> {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(endpoint: string): Promise<unknown> {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export default BaseApiService;
