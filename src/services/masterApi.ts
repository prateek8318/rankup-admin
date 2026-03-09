import axios from 'axios';
import { appConfig } from '@/services/appConfig';

// Separate axios instance for Master Service (without credentials to avoid CORS issues)
const masterApiClient = axios.create({
  baseURL: '/api', // Use relative URL to go through Vite proxy
  withCredentials: false, // Disable credentials to avoid CORS issues
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: appConfig.requestTimeout,
});

// Separate axios instance for Subscription Service
const subscriptionApiClient = axios.create({
  baseURL: '/api', // Use relative URL to go through Vite proxy
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
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

// Add auth interceptor for Subscription Service
subscriptionApiClient.interceptors.request.use(
  (config) => {
    console.log('=== SUBSCRIPTION API REQUEST ===');
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
subscriptionApiClient.interceptors.response.use(
  (response) => {
    console.log('=== SUBSCRIPTION API RESPONSE INTERCEPTOR ===');
    console.log('Response URL:', response.config.url);
    console.log('Response Status:', response.status);
    console.log('Response Data:', response.data);
    return response;
  },
  (error) => {
    console.log('=== SUBSCRIPTION API ERROR INTERCEPTOR ===');
    console.log('Error URL:', error.config?.url);
    console.log('Error Status:', error.response?.status);
    console.log('Error Data:', error.response?.data);
    return Promise.reject(error);
  }
);

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
    // Transform data to send only backend-compatible fields
    const backendData = {
      name: data.name || data.nameEn, // Use name or fallback to nameEn
      code: data.code,
      isActive: data.isActive
    };
    console.log('Creating country with data:', backendData); // Debug log
    return masterApiClient.post('/countries', backendData);
  },
  
  update: (id: number, data: UpdateCountryDto) => {
    // Transform data to send backend-compatible structure with required fields
    const backendData = {
      id: id, // Required: Must match URL ID
      nameEn: data.nameEn || '', // Required: English name
      nameHi: data.nameHi || '', // Required: Hindi name
      code: data.code || '', // Required: Country code
      subdivisionLabelEn: data.subdivisionLabelEn,
      subdivisionLabelHi: data.subdivisionLabelHi,
      isActive: data.isActive !== undefined ? data.isActive : true
    };
    console.log('Updating country with data:', backendData); // Debug log
    return masterApiClient.put(`/countries/${id}`, backendData);
  },
  
  delete: (id: number) => 
    masterApiClient.delete(`/countries/${id}`),
  
  updateStatus: (id: number, isActive: boolean) => 
    masterApiClient.patch(`/countries/${id}/status`, isActive)
};

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
  name?: string; // Optional: Single name field for backend compatibility
  nameEn?: string; // Optional: English name
  nameHi?: string; // Optional: Hindi name
  code: string; // Required: Country code
  subdivisionLabelEn?: string; // Optional: Subdivision label English
  subdivisionLabelHi?: string; // Optional: Subdivision label Hindi
  isActive?: boolean; // Optional: Active status
}

export interface UpdateCountryDto {
  id: number; // Required: ID must match URL ID
  nameEn: string; // Required: English name
  nameHi: string; // Required: Hindi name  
  code: string; // Required: Country code
  subdivisionLabelEn?: string; // Optional: Subdivision label English
  subdivisionLabelHi?: string; // Optional: Subdivision label Hindi
  isActive?: boolean; // Optional: Active status
}

export interface CountryDto {
  id: number;
  name: string; // Main name field (from backend)
  nameEn?: string; // English name (frontend derived)
  nameHi?: string; // Hindi name (frontend derived)
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

export const subscriptionApi = {
  // Admin APIs
  createPlan: (data: CreateSubscriptionPlanDto) => 
    subscriptionApiClient.post('/admin/subscription-plans', data),
  
  updatePlan: (id: number, data: UpdateSubscriptionPlanDto) => 
    subscriptionApiClient.put(`/admin/subscription-plans/${id}`, data),
  
  deletePlan: (id: number) => 
    subscriptionApiClient.delete(`/admin/subscription-plans/${id}`),
  
  togglePlanStatus: (id: number, isActive: boolean) => 
    subscriptionApiClient.patch(`/admin/subscription-plans/${id}/status`, isActive),
  
  // User-facing APIs
  getActivePlans: (language: string = 'en') => 
    subscriptionApiClient.get(`/user/UserPlans/active?language=${language}`),
  
  getPlansByExam: (examCategory: string, language: string = 'en') => 
    subscriptionApiClient.get(`/user/UserPlans/by-exam/${examCategory}?language=${language}`),
  
  getPlanById: (id: number, language: string = 'en') => 
    subscriptionApiClient.get(`/user/UserPlans/${id}?language=${language}`),
  
  // Admin get all plans (for management)
  getAllPlans: () => 
    subscriptionApiClient.get('/admin/subscription-plans'),
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
  
  create: (data: CreateSubjectDto) => 
    masterApiClient.post('/subjects', data),
  
  update: (id: number, data: UpdateSubjectDto) => 
    masterApiClient.put(`/subjects/${id}`, data),
  
  delete: (id: number) => 
    masterApiClient.delete(`/subjects/${id}`),
  
  updateStatus: (id: number, isActive: boolean) => 
    masterApiClient.patch(`/subjects/${id}/status`, isActive)
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

export interface ApiResponseDto<T> {
  success: boolean;
  data?: T;
  message?: string;
  errorMessage?: string;
}
