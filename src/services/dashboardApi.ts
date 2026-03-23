import apiClient from '@/services/apiClient';
import { appConfig } from '@/services/appConfig';
import { notificationService } from "@/services/notificationService";

const BASE_URL = appConfig.apiBaseUrl;

interface DashboardParams {
  page: number;
  rowsPerPage: number;
  searchQuery: string;
}

const buildUrl = (path: string, params?: Record<string, string | number | boolean | undefined>) => {
  const searchParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
  }

  return `${path}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
};

const request = async <T = any>(url: string, options?: { method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'; data?: unknown }): Promise<T> => {
  const method = options?.method ?? 'GET';
  const response = await apiClient.request<T>({
    method,
    url,
    data: options?.data,
  });

  return response.data;
};

export const getDashboardTotals = async () => request(`${BASE_URL}/api/admin/dashboard/totals`);

export const getDashboardOverview = async () => request(`${BASE_URL}/api/admin/dashboard/overview`);

export const getDashboardStats = async ({ page = 1, rowsPerPage = 10, searchQuery = "" }: Partial<DashboardParams> = {}) =>
  request(buildUrl(`${BASE_URL}/api/admin/dashboard/stats`, {
    search: searchQuery,
    page,
    limit: rowsPerPage,
  }));

export const getUsersCount = async () => {
  const result = await request<any>('/api/admin/users/count');

  if (result?.success && result.data) {
    return result.data;
  }

  return result;
};

export const getCMSList = async ({ page = 1, limit = 10, search = "", language = "", languages = "" }: { page?: number; limit?: number; search?: string; language?: string; languages?: string } = {}) =>
  request(buildUrl('http://192.168.1.22:5009/api/cms', {
    page,
    limit,
    search,
    language,
    languages,
  }));

export const getCMSContent = async (key: string, language: string = "en") =>
  request(buildUrl(`http://192.168.1.22:5009/api/cms/${key}`, { language }));

export const getCMSKeys = async () => request('http://192.168.1.22:5008/api/cms/keys');

export const createCMS = async (data: unknown) => {
  const result = await request('http://192.168.1.22:5009/api/cms', {
    method: 'POST',
    data,
  });
  notificationService.success("CMS content created successfully!");
  return result;
};

export const updateCMS = async (id: string, data: unknown) => {
  const result = await request(`http://192.168.1.22:5009/api/cms/${id}`, {
    method: 'PUT',
    data,
  });
  notificationService.success("CMS content updated successfully!");
  return result;
};

export const deleteCMS = async (id: string) => {
  const result = await request(`http://192.168.1.22:5009/api/cms/${id}`, {
    method: 'DELETE',
  });
  notificationService.success("CMS content deleted successfully!");
  return result;
};

export const updateCMSStatus = async (id: string, status: boolean) => {
  const result = await request(`http://192.168.1.22:5009/api/cms/${id}/status`, {
    method: 'PATCH',
    data: { isActive: status },
  });
  notificationService.success("CMS status updated successfully!");
  return result;
};

export const getExams = async ({ page = 1, limit = 10, search = "" }: { page?: number; limit?: number; search?: string } = {}) =>
  request(buildUrl('/api/admin/exams', { page, limit, search }));

export const getExamsCount = async () => request('/api/admin/exams/count');

export const getUsers = async ({ page = 1, limit = 10, search = "" }: { page?: number; limit?: number; search?: string } = {}) =>
  request(buildUrl('/api/admin/users', { page, limit, search }));

export const getAllDeashboard = async ({ page, rowsPerPage, searchQuery }: DashboardParams) => {
  return getDashboardStats({ page, rowsPerPage, searchQuery });
};
