import { createApiClient } from '@/services/axios';
import { appConfig } from '@/services/appConfig';
import { categoryApi } from '@/services/master/categoriesApi';
import { languageApi } from '@/services/master/languageApi';
import { streamApi } from '@/services/master/streamsApi';

const masterApiClient = createApiClient('/api');
const subscriptionApiClient = createApiClient('/api');

export { categoryApi, languageApi, streamApi };
export type {
  CategoryDto,
  CreateCategoryDto,
  CreateLanguageDto,
  LanguageDto,
  UpdateCategoryDto,
  UpdateLanguageDto,
} from '@/services/master/types';

export interface CreateStateDto {
  name: string;
  code: string;
  countryCode: string;
  names?: StateNameDto[];
  isActive?: boolean;
}

export interface UpdateStateDto {
  name?: string;
  code?: string;
  countryCode?: string;
  names?: StateNameDto[];
  isActive?: boolean;
}

export interface StateNameDto {
  languageId: number;
  languageCode?: string;
  languageName?: string;
  name: string;
}

export interface StateDto {
  id: number;
  name: string;
  code: string;
  countryCode: string;
  names: StateNameDto[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCountryDto {
  name?: string;
  nameEn?: string;
  nameHi?: string;
  code: string;
  subdivisionLabelEn?: string;
  subdivisionLabelHi?: string;
  isActive?: boolean;
}

export interface UpdateCountryDto {
  id: number;
  nameEn: string;
  nameHi: string;
  code: string;
  subdivisionLabelEn?: string;
  subdivisionLabelHi?: string;
  isActive?: boolean;
}

export interface CountryDto {
  id: number;
  name: string;
  nameEn?: string;
  nameHi?: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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

  create: (data: CreateStateDto) => masterApiClient.post('/states', data),
  update: (id: number, data: UpdateStateDto) => masterApiClient.put(`/states/${id}`, data),
  delete: (id: number) => masterApiClient.delete(`/states/${id}`),
  updateStatus: (id: number, isActive: boolean) => masterApiClient.patch(`/states/${id}/status`, isActive),
  seedLanguages: () => masterApiClient.post('/states/seed-languages'),
  deleteEmptyNames: () => masterApiClient.delete('/states/empty-names'),
};

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

  create: (data: CreateCountryDto) => {
    const backendData = {
      name: data.name || data.nameEn,
      code: data.code,
      isActive: data.isActive,
    };
    return masterApiClient.post('/countries', backendData);
  },

  update: (id: number, data: UpdateCountryDto) => {
    const backendData = {
      id,
      nameEn: data.nameEn || '',
      nameHi: data.nameHi || '',
      code: data.code || '',
      subdivisionLabelEn: data.subdivisionLabelEn,
      subdivisionLabelHi: data.subdivisionLabelHi,
      isActive: data.isActive !== undefined ? data.isActive : true,
    };
    return masterApiClient.put(`/countries/${id}`, backendData);
  },

  delete: (id: number) => masterApiClient.delete(`/countries/${id}`),
  updateStatus: (id: number, isActive: boolean) => masterApiClient.patch(`/countries/${id}/status`, isActive),
};

export interface CreateSubscriptionPlanDto {
  name: string;
  description: string;
  type: string;
  price: number;
  currency: string;
  testPapersCount: number;
  discount: number;
  duration: number;
  durationType: string;
  validityDays: number;
  examCategory: string;
  features: string[];
  imageUrl: string | null;
  cardColorTheme: string;
  isPopular: boolean;
  isRecommended: boolean;
  sortOrder: number;
  translations: SubscriptionPlanTranslationDto[];
}

export interface UpdateSubscriptionPlanDto {
  name?: string;
  description?: string;
  type?: string;
  price?: number;
  currency?: string;
  testPapersCount?: number;
  discount?: number;
  duration?: number;
  durationType?: string;
  validityDays?: number;
  examCategory?: string;
  features?: string[];
  imageUrl?: string | null;
  cardColorTheme?: string;
  isPopular?: boolean;
  isRecommended?: boolean;
  sortOrder?: number;
  translations?: SubscriptionPlanTranslationDto[];
}

export interface SubscriptionPlanTranslationDto {
  languageCode: string;
  name: string;
  description: string;
  features: string[];
}

export interface SubscriptionPlanDto {
  id: number;
  name: string;
  description: string;
  type: string;
  price: number;
  currency: string;
  testPapersCount: number;
  discount: number;
  duration: number;
  durationType: string;
  validityDays: number;
  examCategory: string;
  examType: string;
  features: string[];
  imageUrl: string | null;
  isPopular: boolean;
  isRecommended: boolean;
  cardColorTheme: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  translations: SubscriptionPlanTranslationDto[];
}

export interface SubscriptionPlanListDto {
  id: number;
  name: string;
  description: string;
  type: string;
  price: number;
  currency: string;
  testPapersCount: number;
  discount: number;
  duration: number;
  durationType: string;
  validityDays: number;
  examCategory: string;
  examType: string;
  features: string[];
  imageUrl: string | null;
  isPopular: boolean;
  isRecommended: boolean;
  cardColorTheme: string;
  isActive: boolean;
}

export const subscriptionApi = {
  createPlan: (data: CreateSubscriptionPlanDto) => subscriptionApiClient.post('/admin/subscription-plans', data),
  updatePlan: (id: number, data: UpdateSubscriptionPlanDto) => subscriptionApiClient.put(`/admin/subscription-plans/${id}`, data),
  deletePlan: (id: number) => subscriptionApiClient.delete(`/admin/subscription-plans/${id}`),
  togglePlanStatus: (id: number, isActive: boolean) => subscriptionApiClient.patch(`/admin/subscription-plans/${id}/status`, isActive),
  getActivePlans: (language = 'en') => subscriptionApiClient.get(`/user/UserPlans/active?language=${language}`),
  getPlansByExam: (examCategory: string, language = 'en') => subscriptionApiClient.get(`/user/UserPlans/by-exam/${examCategory}?language=${language}`),
  getPlanById: (id: number, language = 'en') => subscriptionApiClient.get(`/user/UserPlans/${id}?language=${language}`),
  getAllPlans: () => subscriptionApiClient.get('/admin/subscription-plans'),
};

export const qualificationApi = {
  getAll: (languageId?: number, countryCode?: string) => {
    const params = new URLSearchParams();
    if (languageId) params.append('languageId', languageId.toString());
    if (countryCode) params.append('countryCode', countryCode);
    const queryString = params.toString();
    return masterApiClient.get(`/qualifications${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: number, languageId?: number) => {
    const params = new URLSearchParams();
    if (languageId) params.append('languageId', languageId.toString());
    const queryString = params.toString();
    return masterApiClient.get(`/qualifications/${id}${queryString ? `?${queryString}` : ''}`);
  },

  create: (data: unknown) => masterApiClient.post('/qualifications', data),
  update: (id: number, data: unknown) => masterApiClient.put(`/qualifications/${id}`, data),
  delete: (id: number) => masterApiClient.delete(`/qualifications/${id}`),
  updateStatus: (id: number, isActive: boolean) => masterApiClient.patch(`/qualifications/${id}/status`, { isActive }),
};

export interface CreateSubjectDto {
  name: string;
  description?: string;
  names?: SubjectNameDto[];
  isActive?: boolean;
}

export interface UpdateSubjectDto {
  name?: string;
  description?: string;
  names?: SubjectNameDto[];
  isActive?: boolean;
}

export interface SubjectNameDto {
  languageId: number;
  languageCode?: string;
  languageName?: string;
  name: string;
  description?: string;
}

export interface SubjectDto {
  id: number;
  name: string;
  description?: string;
  names: SubjectNameDto[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const subjectApi = {
  getAll: (languageId?: number) => {
    const params = new URLSearchParams();
    if (languageId) params.append('languageId', languageId.toString());
    const queryString = params.toString();
    return masterApiClient.get(`/subjects${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: number, languageId?: number) => {
    const params = new URLSearchParams();
    if (languageId) params.append('languageId', languageId.toString());
    const queryString = params.toString();
    return masterApiClient.get(`/subjects/${id}${queryString ? `?${queryString}` : ''}`);
  },

  create: (data: CreateSubjectDto) => masterApiClient.post('/subjects', data),
  update: (id: number, data: UpdateSubjectDto) => masterApiClient.put(`/subjects/${id}`, data),
  delete: (id: number) => masterApiClient.delete(`/subjects/${id}`),
  updateStatus: (id: number, isActive: boolean) => masterApiClient.patch(`/subjects/${id}/status`, isActive),
};

export interface CreateExamDto {
  name: string;
  description?: string;
  countryCode: string;
  minAge?: number;
  maxAge?: number;
  imageUrl?: string;
  isInternational?: boolean;
  namesJson?: string;
  relationsJson?: string;
}

export interface UpdateExamDto {
  id: number;
  name?: string;
  description?: string;
  countryCode?: string;
  minAge?: number;
  maxAge?: number;
  imageUrl?: string;
  isInternational?: boolean;
  namesJson?: string;
  relationsJson?: string;
}

export interface ExamDto {
  id: number;
  name: string;
  description?: string;
  countryCode: string;
  minAge?: number;
  maxAge?: number;
  imageUrl?: string;
  isInternational: boolean;
  namesJson?: string;
  relationsJson?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const examApi = {
  getAll: (
    language?: string,
    languageId?: number,
    countryCode?: string,
    qualificationId?: number,
    streamId?: number,
    minAge?: number,
    maxAge?: number,
  ) => {
    const params = new URLSearchParams();
    if (language) params.append('language', language);
    if (languageId) params.append('languageId', languageId.toString());
    if (countryCode) params.append('countryCode', countryCode);
    if (qualificationId) params.append('qualificationId', qualificationId.toString());
    if (streamId) params.append('streamId', streamId.toString());
    if (minAge) params.append('minAge', minAge.toString());
    if (maxAge) params.append('maxAge', maxAge.toString());
    const queryString = params.toString();
    return masterApiClient.get(`/exams${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: number, languageId?: number) => {
    const params = new URLSearchParams();
    if (languageId) params.append('languageId', languageId.toString());
    const queryString = params.toString();
    return masterApiClient.get(`/exams/${id}${queryString ? `?${queryString}` : ''}`);
  },

  create: (data: CreateExamDto) => masterApiClient.post('/exams', data),
  update: (id: number, data: UpdateExamDto) => masterApiClient.put(`/exams/${id}`, data),
  delete: (id: number) => masterApiClient.delete(`/exams/${id}`),
  deleteImage: (examId: number) => masterApiClient.delete(`/exams/${examId}/delete-image`),
  updateStatus: (id: number, isActive: boolean) => masterApiClient.patch(`/exams/${id}/status`, isActive),
};

export interface ApiResponseDto<T> {
  success: boolean;
  data?: T;
  message?: string;
  errorMessage?: string;
}

export const masterApiConfig = appConfig;
