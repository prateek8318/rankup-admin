import { apiEndpoints } from './apiEndpoints';
import apiClient from './apiClient';

// TypeScript interfaces based on the API specification
export interface ExamDto {
  id: number;
  name: string;
  description: string;
  durationInMinutes: number;
  totalMarks: number;
  passingMarks: number;
  isActive: boolean;
  createdAt: string;
  imageUrl?: string;
  isInternational: boolean;
  qualificationIds: number[];
  streamIds: number[];
}

export interface CreateExamDto {
  name: string;
  description: string;
  durationInMinutes: number;
  totalMarks: number;
  passingMarks: number;
  imageUrl?: string;
  isInternational: boolean;
  qualificationIds: number[];
  streamIds: number[];
}

export interface UpdateExamDto {
  id: number;
  name: string;
  description: string;
  durationInMinutes: number;
  totalMarks: number;
  passingMarks: number;
  imageUrl?: string;
  isInternational: boolean;
  qualificationIds: number[];
  streamIds: number[];
}

export interface ExamListParams {
  page?: number;
  limit?: number;
  qualificationId?: number;
  streamId?: number;
  isInternational?: boolean;
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
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.qualificationId) queryParams.append('qualificationId', params.qualificationId.toString());
    if (params.streamId) queryParams.append('streamId', params.streamId.toString());
    if (params.isInternational !== undefined) queryParams.append('isInternational', params.isInternational.toString());
    if (params.search) queryParams.append('search', params.search);

    const url = queryParams.toString() 
      ? `${apiEndpoints.EXAMS.GET_ALL}?${queryParams.toString()}`
      : apiEndpoints.EXAMS.GET_ALL;

    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching exams:', error);
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
    return response.data;
  } catch (error) {
    console.error('Error creating exam:', error);
    throw error;
  }
};

/**
 * Update exam (Admin only)
 */
export const updateExam = async (id: number, examData: UpdateExamDto): Promise<void> => {
  try {
    await apiClient.put(apiEndpoints.EXAMS.UPDATE(id.toString()), examData);
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
 * Update exam status (Admin only)
 */
export const updateExamStatus = async (id: number, isActive: boolean): Promise<void> => {
  try {
    await apiClient.patch(apiEndpoints.EXAMS.UPDATE_STATUS(id.toString()), isActive);
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
  streamId?: number
): Promise<ApiResponse<ExamDto[]>> => {
  try {
    const url = streamId
      ? `${apiEndpoints.EXAMS.GET_BY_QUALIFICATION(qualificationId.toString())}?streamId=${streamId}`
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
