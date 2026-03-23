import { createApiClient } from '@/services/axios';
import type {
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './types';

const masterApiClient = createApiClient('/api');

const buildLanguageQuery = (language?: string) => {
  const params = new URLSearchParams();
  if (language) {
    params.append('language', language);
  }
  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
};

export const categoryApi = {
  getCategories: (language?: string) =>
    masterApiClient.get(`/categories${buildLanguageQuery(language)}`),

  getQualifications: (language?: string) =>
    masterApiClient.get(`/categories/qualifications${buildLanguageQuery(language)}`),

  getExamCategories: (language?: string) =>
    masterApiClient.get(`/categories/exam-categories${buildLanguageQuery(language)}`),

  getStreams: (language?: string) =>
    masterApiClient.get(`/categories/streams${buildLanguageQuery(language)}`),

  getAllOptimized: (language?: string) =>
    masterApiClient.get(`/categories/all-optimized${buildLanguageQuery(language)}`),

  getAll: (language?: string) =>
    masterApiClient.get(`/categories/all${buildLanguageQuery(language)}`),

  getById: (id: number, language?: string) =>
    masterApiClient.get(`/categories/${id}${buildLanguageQuery(language)}`),

  create: (data: CreateCategoryDto) =>
    masterApiClient.post<CategoryDto>('/categories', data),

  update: (id: number, data: UpdateCategoryDto) =>
    masterApiClient.put<CategoryDto>(`/categories/${id}`, data),

  delete: (id: number) =>
    masterApiClient.delete(`/categories/${id}`),

  updateStatus: (id: number, isActive: boolean) =>
    masterApiClient.patch(`/categories/${id}/status`, isActive),
};

export type {
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './types';
