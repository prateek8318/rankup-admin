import { apiEndpoints } from './apiEndpoints';
import apiClient from './apiClient';

// TypeScript interfaces based on the API specification
export interface SubscriptionPlanDto {
  id: number;
  planName?: string;
  name?: string;
  description: string;
  type?: number;
  examType?: string;
  examCategory?: string;
  price: number;
  currency: string;
  testPapersCount: number;
  discount: number;
  duration: number;
  durationType: string;
  validityDays?: number;
  features: string[];
  imageUrl: string | null;
  isPopular: boolean;
  isRecommended: boolean;
  cardColorTheme?: string;
  colorCode?: string;
  sortOrder?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
  translations?: SubscriptionPlanTranslationDto[];
}

export interface CreateSubscriptionPlanDto {
  name: string;
  description: string;
  type: number;
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
  isPopular: boolean;
  isRecommended: boolean;
  cardColorTheme: string;
  sortOrder: number;
  translations?: SubscriptionPlanTranslationDto[];
}

export interface UpdateSubscriptionPlanDto {
  planName?: string;
  examType?: string;
  price?: number;
  duration?: number;
  colorCode?: string;
  isPopular?: boolean;
  isRecommended?: boolean;
  isActive?: boolean;
  // Full update fields
  name?: string;
  description?: string;
  type?: number;
  currency?: string;
  testPapersCount?: number;
  discount?: number;
  durationType?: string;
  validityDays?: number;
  examCategory?: string;
  features?: string[];
  imageUrl?: string | null;
  cardColorTheme?: string;
  sortOrder?: number;
  translations?: SubscriptionPlanTranslationDto[];
}

export interface SubscriptionPlanTranslationDto {
  languageCode: string;
  name: string;
  description: string;
  features: string[];
}

export interface SubscriptionPlanListParams {
  page?: number;
  pageSize?: number;
  language?: string;
  examType?: string;
  isActive?: boolean;
  isPopular?: boolean;
  isRecommended?: boolean;
}

export interface PaginatedSubscriptionPlanResponse {
  success: boolean;
  data: SubscriptionPlanDto[];
  pagination?: {
    page: number;
    pageSize: number;
    totalCount: number;
  };
}

export interface SubscriptionPlanStats {
  totalPlans: number;
  activePlans: number;
  inactivePlans: number;
  popularPlans: number;
  recommendedPlans: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorMessage?: string;
}

/**
 * Get all subscription plans with pagination
 */
export const getSubscriptionPlansList = async (
  params: SubscriptionPlanListParams = {}
): Promise<PaginatedSubscriptionPlanResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params.language) queryParams.append('language', params.language);

    const url = queryParams.toString() 
      ? `${apiEndpoints.SUBSCRIPTIONS.PLANS.GET_ALL}?${queryParams.toString()}`
      : apiEndpoints.SUBSCRIPTIONS.PLANS.GET_ALL;

    const response = await apiClient.get(url);
    
    // Handle both wrapped and direct responses
    if (response.data.success !== undefined) {
      return response.data;
    } else if (Array.isArray(response.data)) {
      return {
        success: true,
        data: response.data,
        pagination: {
          page: params.page || 1,
          pageSize: params.pageSize || 50,
          totalCount: response.data.length
        }
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    throw error;
  }
};

/**
 * Get subscription plan by ID
 */
export const getSubscriptionPlanById = async (
  id: number,
  language?: string
): Promise<ApiResponse<SubscriptionPlanDto>> => {
  try {
    const queryParams = new URLSearchParams();
    if (language) queryParams.append('language', language);
    
    const url = queryParams.toString()
      ? `${apiEndpoints.SUBSCRIPTIONS.PLANS.GET_BY_ID(id.toString())}?${queryParams.toString()}`
      : apiEndpoints.SUBSCRIPTIONS.PLANS.GET_BY_ID(id.toString());

    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription plan by ID:', error);
    throw error;
  }
};

/**
 * Create subscription plan (Admin only)
 */
export const createSubscriptionPlan = async (
  planData: CreateSubscriptionPlanDto
): Promise<ApiResponse<SubscriptionPlanDto>> => {
  try {
    const response = await apiClient.post(apiEndpoints.SUBSCRIPTIONS.PLANS.CREATE, planData);
    return response.data;
  } catch (error) {
    console.error('Error creating subscription plan:', error);
    throw error;
  }
};

/**
 * Update subscription plan (Admin only)
 */
export const updateSubscriptionPlan = async (
  id: number,
  planData: UpdateSubscriptionPlanDto
): Promise<ApiResponse<SubscriptionPlanDto>> => {
  try {
    const response = await apiClient.put(
      apiEndpoints.SUBSCRIPTIONS.PLANS.UPDATE(id.toString()),
      planData
    );
    return response.data;
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    throw error;
  }
};

/**
 * Delete subscription plan (Admin only)
 */
export const deleteSubscriptionPlan = async (id: number): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await apiClient.delete(apiEndpoints.SUBSCRIPTIONS.PLANS.DELETE(id.toString()));
    return response.data;
  } catch (error) {
    console.error('Error deleting subscription plan:', error);
    throw error;
  }
};

/**
 * Toggle popular status (Admin only)
 */
export const togglePopularStatus = async (id: number): Promise<ApiResponse<Partial<SubscriptionPlanDto>>> => {
  try {
    const response = await apiClient.patch(apiEndpoints.SUBSCRIPTIONS.PLANS.TOGGLE_POPULAR(id.toString()));
    return response.data;
  } catch (error) {
    console.error('Error toggling popular status:', error);
    throw error;
  }
};

/**
 * Toggle recommended status (Admin only)
 */
export const toggleRecommendedStatus = async (id: number): Promise<ApiResponse<Partial<SubscriptionPlanDto>>> => {
  try {
    const response = await apiClient.patch(apiEndpoints.SUBSCRIPTIONS.PLANS.TOGGLE_RECOMMENDED(id.toString()));
    return response.data;
  } catch (error) {
    console.error('Error toggling recommended status:', error);
    throw error;
  }
};

/**
 * Toggle active status (Admin only)
 */
export const toggleActiveStatus = async (id: number): Promise<ApiResponse<Partial<SubscriptionPlanDto>>> => {
  try {
    const response = await apiClient.patch(apiEndpoints.SUBSCRIPTIONS.PLANS.TOGGLE_STATUS(id.toString()));
    return response.data;
  } catch (error) {
    console.error('Error toggling active status:', error);
    throw error;
  }
};

/**
 * Get subscription plan statistics
 */
export const getSubscriptionPlanStats = async (): Promise<SubscriptionPlanStats> => {
  try {
    const response = await apiClient.get(apiEndpoints.SUBSCRIPTIONS.PLANS.GET_STATS);
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription plan stats:', error);
    throw error;
  }
};

/**
 * Get filtered subscription plans
 */
export const getFilteredSubscriptionPlans = async (
  params: SubscriptionPlanListParams = {}
): Promise<PaginatedSubscriptionPlanResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.examType) queryParams.append('examType', params.examType);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params.isPopular !== undefined) queryParams.append('isPopular', params.isPopular.toString());
    if (params.isRecommended !== undefined) queryParams.append('isRecommended', params.isRecommended.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    const url = queryParams.toString() 
      ? `${apiEndpoints.SUBSCRIPTIONS.PLANS.GET_FILTERED}?${queryParams.toString()}`
      : apiEndpoints.SUBSCRIPTIONS.PLANS.GET_FILTERED;

    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching filtered subscription plans:', error);
    throw error;
  }
};

/**
 * Get active subscription plans only
 */
export const getActiveSubscriptionPlans = async (
  params: Omit<SubscriptionPlanListParams, 'isActive'> = {}
): Promise<PaginatedSubscriptionPlanResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params.language) queryParams.append('language', params.language);
    if (params.examType) queryParams.append('examType', params.examType);
    if (params.isPopular !== undefined) queryParams.append('isPopular', params.isPopular.toString());
    if (params.isRecommended !== undefined) queryParams.append('isRecommended', params.isRecommended.toString());

    const url = queryParams.toString() 
      ? `${apiEndpoints.SUBSCRIPTIONS.PLANS.GET_ACTIVE}?${queryParams.toString()}`
      : apiEndpoints.SUBSCRIPTIONS.PLANS.GET_ACTIVE;

    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching active subscription plans:', error);
    throw error;
  }
};

export default {
  getSubscriptionPlansList,
  getSubscriptionPlanById,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  togglePopularStatus,
  toggleRecommendedStatus,
  toggleActiveStatus,
  getSubscriptionPlanStats,
  getFilteredSubscriptionPlans,
  getActiveSubscriptionPlans,
};
