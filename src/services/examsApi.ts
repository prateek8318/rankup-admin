import { apiEndpoints } from './apiEndpoints';
import apiClient from './apiClient';

// TypeScript interfaces based on the API specification
export interface ExamName {
  languageId: number;
  name: string;
  description: string;
}

export interface ExamDto {
  id: number;
  name: string;
  description: string;
  countryCode: string;
  minAge: number;
  maxAge: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  names: ExamName[];
  qualificationIds: number[];
  streamIds: number[];
  qualifications?: { id: number; name: string }[];
  streams?: { id: number; name: string }[];
}

export interface CreateExamDto {
  name: string;
  description: string;
  countryCode: string;
  minAge: number;
  maxAge: number;
  imageUrl?: string;
  names: ExamName[];
  qualificationIds: number[];
  streamIds: number[];
}

export interface UpdateExamDto {
  id: number;
  name: string;
  description: string;
  countryCode: string;
  minAge: number;
  maxAge: number;
  imageUrl?: string;
  names: ExamName[];
  qualificationIds: number[];
  streamIds: number[];
}

export interface ExamListParams {
  languageId?: number;
  countryCode?: string;
  qualificationId?: number;
  streamId?: number;
  minAge?: number;
  maxAge?: number;
  page?: number;
  limit?: number;
  search?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  totalCount?: number;
  message?: string;
}

/**
 * Get all exams with optional filtering
 */
export const getExamsList = async (params: ExamListParams = {}): Promise<ApiResponse<ExamDto[]>> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.languageId) queryParams.append('languageId', params.languageId.toString());
    if (params.countryCode) queryParams.append('countryCode', params.countryCode);
    if (params.qualificationId) queryParams.append('qualificationId', params.qualificationId.toString());
    if (params.streamId) queryParams.append('streamId', params.streamId.toString());
    if (params.minAge) queryParams.append('minAge', params.minAge.toString());
    if (params.maxAge) queryParams.append('maxAge', params.maxAge.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);

    const url = queryParams.toString() 
      ? `${apiEndpoints.EXAMS.GET_ALL}?${queryParams.toString()}`
      : apiEndpoints.EXAMS.GET_ALL;

    console.log('Making API call to:', url);
    const response = await apiClient.get(url);
    console.log('Raw API response:', response.data);
    
    // Handle the case where API returns data directly without wrapper
    let apiResponse: ApiResponse<ExamDto[]>;
    if (response.data.success !== undefined && response.data.data) {
      // API returned wrapped response with success flag
      apiResponse = response.data;
    } else if (Array.isArray(response.data)) {
      // API returned array directly, wrap it in expected format
      apiResponse = {
        success: true,
        data: response.data,  
        totalCount: response.data.length
      };
    } else if (response.data.data && Array.isArray(response.data.data)) {
      // API returned { data: [...] }
      apiResponse = {
        success: true,
        data: response.data.data,
        totalCount: response.data.data.length
      };
    } else {
      // Fallback
      apiResponse = response.data;
    }
    
    console.log('Processed API response:', apiResponse);
    return apiResponse;
  } catch (error: any) {
    console.error('Error fetching exams:', error);
    console.error('Error response data:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Error headers:', error.response?.headers);
    throw error;
  }
};

/**
 * Get exam by ID
 */
export const getExamById = async (id: number): Promise<ApiResponse<ExamDto>> => {
  try {
    const response = await apiClient.get(apiEndpoints.EXAMS.GET_BY_ID(id.toString()));
    return response.data;
  } catch (error) {
    console.error('Error fetching exam by ID:', error);
    throw error;
  }
};

/**
 * Create new exam (Admin only)
 */
export const createExam = async (examData: CreateExamDto): Promise<ApiResponse<ExamDto>> => {
  try {
    const response = await apiClient.post(apiEndpoints.EXAMS.CREATE, examData);
    // Handle both wrapped and direct responses
    if (response.data.success !== undefined) {
      return response.data;
    }
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error creating exam:', error);
    throw error;
  }
};

/**
 * Update exam (Admin only)
 */
export const updateExam = async (id: number, examData: UpdateExamDto): Promise<ApiResponse<ExamDto>> => {
  try {
    const response = await apiClient.put(apiEndpoints.EXAMS.UPDATE(id.toString()), examData);
    // Handle both wrapped and direct responses
    if (response.data.success !== undefined) {
      return response.data;
    }
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error updating exam:', error);
    throw error;
  }
};

/**
 * Delete exam (Admin only)
 */
export const deleteExam = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(apiEndpoints.EXAMS.DELETE(id.toString()));
  } catch (error) {
    console.error('Error deleting exam:', error);
    throw error;
  }
};

/**
 * Update exam status (Admin only) - Enable/Disable
 */
export const updateExamStatus = async (id: number, isActive: boolean): Promise<void> => {
  try {
    await apiClient.patch(apiEndpoints.EXAMS.UPDATE_STATUS(id.toString()), isActive, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating exam status:', error);
    throw error;
  }
};

/**
 * Upload exam image (Admin only)
 */
export const uploadExamImage = async (id: number, file: File): Promise<{ imageUrl: string }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(
      apiEndpoints.EXAMS.UPLOAD_IMAGE(id.toString()),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading exam image:', error);
    throw error;
  }
};

/**
 * Get exams by qualification
 */
export const getExamsByQualification = async (
  qualificationId: number,
  languageId?: number,
  countryCode?: string
): Promise<ApiResponse<ExamDto[]>> => {
  try {
    const queryParams = new URLSearchParams();
    if (languageId) queryParams.append('languageId', languageId.toString());
    if (countryCode) queryParams.append('countryCode', countryCode);
    
    const url = queryParams.toString()
      ? `${apiEndpoints.EXAMS.GET_BY_QUALIFICATION(qualificationId.toString())}?${queryParams.toString()}`
      : apiEndpoints.EXAMS.GET_BY_QUALIFICATION(qualificationId.toString());

    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching exams by qualification:', error);
    throw error;
  }
};

/**
 * Get exams for authenticated user
 */
export const getExamsForUser = async (): Promise<ApiResponse<ExamDto[]>> => {
  try {
    const response = await apiClient.get(apiEndpoints.EXAMS.GET_FOR_USER);
    return response.data;
  } catch (error) {
    console.error('Error fetching exams for user:', error);
    throw error;
  }
};

// Legacy functions for backward compatibility
export const getExams = getExamsList;
export const getExamsCount = async (): Promise<ApiResponse<{ totalExams: number }>> => {
  try {
    // Get all exams to count them
    const response = await getExamsList({ limit: 1 });
    return {
      success: true,
      data: { totalExams: response.totalCount || 0 }
    };
  } catch (error) {
    console.error('Error fetching exams count:', error);
    throw error;
  }
};

export default {
  getExamsList,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  updateExamStatus,
  uploadExamImage,
  getExamsByQualification,
  getExamsForUser,
  // Legacy
  getExams,
  getExamsCount,
};
