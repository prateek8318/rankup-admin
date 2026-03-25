import { createApiClient } from '@/services/axios';

const masterApiClient = createApiClient('/api');

export const streamApi = {
  getAll: (languageId?: number, qualificationId?: number) => {
    const params = new URLSearchParams();
    if (languageId) {
      params.append('languageId', languageId.toString());
    }
    if (qualificationId) {
      params.append('qualificationId', qualificationId.toString());
    }
    const queryString = params.toString();

    return masterApiClient.get(`/streams${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: number, languageId?: number) => {
    const params = new URLSearchParams();
    if (languageId) {
      params.append('languageId', languageId.toString());
    }
    const queryString = params.toString();

    return masterApiClient.get(`/streams/${id}${queryString ? `?${queryString}` : ''}`);
  },

  create: (data: unknown) =>
    masterApiClient.post('/streams', data),

  update: (id: number, data: unknown) =>
    masterApiClient.put(`/streams/${id}`, data),

  delete: (id: number) =>
    masterApiClient.delete(`/streams/${id}`),

  updateStatus: (id: number, isActive: boolean) =>
    masterApiClient.patch(`/streams/${id}/status`, { isActive }),

  getByQualification: (qualificationId: number, languageId?: number) => {
    const params = new URLSearchParams();
    params.append('qualificationId', qualificationId.toString());
    if (languageId) {
      params.append('languageId', languageId.toString());
    }

    return masterApiClient.get(`/streams?${params.toString()}`);
  },
};
