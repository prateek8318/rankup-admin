import { createApiClient } from '@/services/axios';
import type {
  CreateLanguageDto,
  LanguageDto,
  UpdateLanguageDto,
} from './types';

const masterApiClient = createApiClient('/api');

export const languageApi = {
  getAll: (language?: string) =>
    masterApiClient.get(`/languages${language ? `?language=${language}` : ''}`),

  getById: (id: number, language?: string) =>
    masterApiClient.get(`/languages/${id}${language ? `?language=${language}` : ''}`),

  create: (data: CreateLanguageDto) =>
    masterApiClient.post('/languages', data),

  update: (id: number, data: UpdateLanguageDto) =>
    masterApiClient.put(`/languages/${id}`, data),

  delete: (id: number) =>
    masterApiClient.delete(`/languages/${id}`),

  updateStatus: (id: number, isActive: boolean) =>
    masterApiClient.patch(`/languages/${id}/status`, isActive),
};

export type {
  CreateLanguageDto,
  LanguageDto,
  UpdateLanguageDto,
} from './types';
