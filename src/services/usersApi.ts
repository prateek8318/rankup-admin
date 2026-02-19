import { apiEndpoints } from './apiEndpoints';
import apiClient from './apiClient';

// TypeScript interfaces based on the API specification
export interface UserDto {
  id: number;
  name: string;
  email?: string;
  phoneNumber: string;
  countryCode: string;
  gender?: string;
  dateOfBirth?: string;
  profilePhoto?: string;
  profilePhotoUrl?: string;
  stateId?: number;
  languageId?: number;
  qualificationId?: number;
  examId?: number;
  categoryId?: number;
  lastLoginAt?: string;
  isPhoneVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  isNewUser: boolean;
  interestedInIntlExam: boolean;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  isActive?: boolean;
}

export interface UserListParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedUserResponse {
  items: UserDto[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorMessage?: string;
}

/**
 * Get all users with pagination
 */
export const getUsersList = async (params: UserListParams = {}): Promise<PaginatedUserResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    const url = queryParams.toString() 
      ? `${apiEndpoints.USERS.GET_ALL}?${queryParams.toString()}`
      : apiEndpoints.USERS.GET_ALL;

    const response = await apiClient.get(url);
    
    console.log('Raw API Response:', response.data); // Debug log
    
    // Handle the actual API response structure: {success, data, message, timestamp}
    if (response.data.success && response.data.data) {
      const allUsers = response.data.data;
      const totalCount = allUsers.length;
      
      // Implement client-side pagination since API returns all users
      const pageSize = params.pageSize || 50;
      const page = params.page || 1;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedUsers = allUsers.slice(startIndex, endIndex);
      
      console.log(`Pagination: Page ${page}, Start ${startIndex}, End ${endIndex}, Showing ${paginatedUsers.length} of ${allUsers.length} users`);
      
      return {
        items: paginatedUsers,
        page: page,
        pageSize: pageSize,
        totalCount: totalCount
      };
    }
    
    // Fallback for other response structures
    if (response.data.items) {
      return response.data;
    } else if (Array.isArray(response.data)) {
      return {
        items: response.data,
        page: params.page || 1,
        pageSize: params.pageSize || 50,
        totalCount: response.data.length
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (id: number): Promise<ApiResponse<UserDto>> => {
  try {
    const response = await apiClient.get(apiEndpoints.USERS.GET_BY_ID(id.toString()));
    return response.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

/**
 * Update user (Admin only)
 */
export const updateUser = async (id: number, userData: UpdateUserDto): Promise<ApiResponse<UserDto>> => {
  try {
    const response = await apiClient.put(apiEndpoints.USERS.UPDATE(id.toString()), userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Delete user (Admin only)
 */
export const deleteUser = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(apiEndpoints.USERS.DELETE(id.toString()));
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

/**
 * Enable/Disable user (Admin only)
 */
export const enableDisableUser = async (id: number, isActive: boolean): Promise<void> => {
  try {
    await apiClient.patch(apiEndpoints.USERS.ENABLE_DISABLE(id.toString()), isActive, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

export default {
  getUsersList,
  getUserById,
  updateUser,
  deleteUser,
  enableDisableUser,
};
