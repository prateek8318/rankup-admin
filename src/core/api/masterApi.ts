import axios from 'axios';
import { appConfig } from '@/core/config/appConfig';

// Separate axios instance for Master Service (without credentials to avoid CORS issues)
const masterApiClient = axios.create({
  baseURL: 'http://localhost:5009/api',
  withCredentials: false, // Disable credentials to avoid CORS issues
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: appConfig.requestTimeout,
});

// Add auth interceptor for Master Service
masterApiClient.interceptors.request.use(
  (config) => {
    console.log('=== API REQUEST ===');
    console.log('URL:', config.url);
    console.log('Method:', config.method);
    console.log('Base URL:', config.baseURL);
    console.log('Full URL:', `${config.baseURL || ''}${config.url || ''}`);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for debugging
masterApiClient.interceptors.response.use(
  (response) => {
    console.log('=== API RESPONSE INTERCEPTOR ===');
    console.log('Response URL:', response.config.url);
    console.log('Response Status:', response.status);
    console.log('Response Data:', response.data);
    return response;
  },
  (error) => {
    console.log('=== API ERROR INTERCEPTOR ===');
    console.log('Error URL:', error.config?.url);
    console.log('Error Status:', error.response?.status);
    console.log('Error Data:', error.response?.data);
    return Promise.reject(error);
  }
);

// Language APIs
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
    masterApiClient.patch(`/languages/${id}/status`, isActive)
};

// State APIs
export const stateApi = {
  getAll: (languageId?: number, countryCode?: string) => {
    const params = new URLSearchParams();
    if (languageId) params.append('languageId', languageId.toString());
    if (countryCode) params.append('countryCode', countryCode);
    const queryString = params.toString();
    return masterApiClient.get(`/states${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id: number, languageId?: number) => {
    const params = new URLSearchParams();
    if (languageId) params.append('languageId', languageId.toString());
    const queryString = params.toString();
    return masterApiClient.get(`/states/${id}${queryString ? `?${queryString}` : ''}`);
  },
  
  create: (data: CreateStateDto) => 
    masterApiClient.post('/states', data),
  
  update: (id: number, data: UpdateStateDto) => 
    masterApiClient.put(`/states/${id}`, data),
  
  delete: (id: number) => 
    masterApiClient.delete(`/states/${id}`),
  
  updateStatus: (id: number, isActive: boolean) => 
    masterApiClient.patch(`/states/${id}/status`, isActive),
  
  seedLanguages: () => 
    masterApiClient.post('/states/seed-languages'),
  
  deleteEmptyNames: () => 
    masterApiClient.delete('/states/empty-names')
};

// Country APIs
export const countryApi = {
  getAll: (language?: string) => {
    const params = new URLSearchParams();
    if (language) params.append('language', language);
    const queryString = params.toString();
    return masterApiClient.get(`/countries${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id: number, language?: string) => {
    const params = new URLSearchParams();
    if (language) params.append('language', language);
    const queryString = params.toString();
    return masterApiClient.get(`/countries/${id}${queryString ? `?${queryString}` : ''}`);
  },
  
  getByCode: (code: string, language?: string) => {
    const params = new URLSearchParams();
    if (language) params.append('language', language);
    const queryString = params.toString();
    return masterApiClient.get(`/countries/code/${code}${queryString ? `?${queryString}` : ''}`);
  },
  
  create: (data: CreateCountryDto) => 
    masterApiClient.post('/countries', data),
  
  update: (id: number, data: UpdateCountryDto) => 
    masterApiClient.put(`/countries/${id}`, data),
  
  delete: (id: number) => 
    masterApiClient.delete(`/countries/${id}`),
  
  updateStatus: (id: number, isActive: boolean) => 
    masterApiClient.patch(`/countries/${id}/status`, isActive)
};

// Category APIs
export const categoryApi = {
  getCategories: (language?: string) => {
    const params = new URLSearchParams();
    if (language) params.append('language', language);
    const queryString = params.toString();
    return masterApiClient.get(`/categories${queryString ? `?${queryString}` : ''}`);
  },
  
  getQualifications: (language?: string) => {
    const params = new URLSearchParams();
    if (language) params.append('language', language);
    const queryString = params.toString();
    return masterApiClient.get(`/categories/qualifications${queryString ? `?${queryString}` : ''}`);
  },
  
  getExamCategories: (language?: string) => {
    const params = new URLSearchParams();
    if (language) params.append('language', language);
    const queryString = params.toString();
    return masterApiClient.get(`/categories/exam-categories${queryString ? `?${queryString}` : ''}`);
  },
  
  getStreams: (language?: string) => {
    const params = new URLSearchParams();
    if (language) params.append('language', language);
    const queryString = params.toString();
    return masterApiClient.get(`/categories/streams${queryString ? `?${queryString}` : ''}`);
  },
  
  getAllOptimized: (language?: string) => {
    const params = new URLSearchParams();
    if (language) params.append('language', language);
    const queryString = params.toString();
    return masterApiClient.get(`/categories/all-optimized${queryString ? `?${queryString}` : ''}`);
  },
  
  getAll: (language?: string) => {
    const params = new URLSearchParams();
    if (language) params.append('language', language);
    const queryString = params.toString();
    return masterApiClient.get(`/categories/all${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id: number, language?: string) => {
    const params = new URLSearchParams();
    if (language) params.append('language', language);
    const queryString = params.toString();
    return masterApiClient.get(`/categories/${id}${queryString ? `?${queryString}` : ''}`);
  },
  
  create: (data: CreateCategoryDto) => 
    masterApiClient.post('/categories', data),
  
  update: (id: number, data: UpdateCategoryDto) => 
    masterApiClient.put(`/categories/${id}`, data),
  
  delete: (id: number) => 
    masterApiClient.delete(`/categories/${id}`),
  
  updateStatus: (id: number, isActive: boolean) => 
    masterApiClient.patch(`/categories/${id}/status`, isActive)
};

// DTO Types
export interface CreateLanguageDto {
  name: string;
  code: string;
  isActive?: boolean;
}

export interface UpdateLanguageDto {
  name?: string;
  code?: string;
  isActive?: boolean;
}

export interface LanguageDto {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStateDto {
  name: string;
  countryCode: string;
  languageId?: number;
  isActive?: boolean;
}

export interface UpdateStateDto {
  name?: string;
  countryCode?: string;
  languageId?: number;
  isActive?: boolean;
}

export interface StateDto {
  id: number;
  name: string;
  countryCode: string;
  languageId?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCountryDto {
  name: string;
  code: string;
  isActive?: boolean;
}

export interface UpdateCountryDto {
  name?: string;
  code?: string;
  isActive?: boolean;
}

export interface CountryDto {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  nameEn: string; // required
  nameHi?: string; // optional
  key: string; // required
  type: 'category' | 'qualification' | 'exam_category' | 'stream'; // required
}

export interface UpdateCategoryDto {
  id: number;
  nameEn?: string;
  nameHi?: string;
  key?: string;
  type?: 'category' | 'qualification' | 'exam_category' | 'stream';
}

export interface CategoryDto {
  id: number;
  name: string; // localized based on language parameter
  nameEn: string; // English name from DB
  nameHi?: string; // Hindi name from DB, optional
  key: string;
  type: 'category' | 'qualification' | 'exam_category' | 'stream';
  isActive: boolean;
  createdAt: string;
  updatedAt?: string; // nullable
}

// Common Response Types
export interface ApiResponseDto<T> {
  success: boolean;
  data?: T;
  message?: string;
  errorMessage?: string;
}
