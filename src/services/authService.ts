import BaseApiService from '@/services/baseApi';
import API_CONFIG from '@/services/apiConfig';
import { notificationService } from "@/services/notificationService";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  Success: boolean;
  Token?: string;
  RefreshToken?: string;
  Admin?: any;
  Message?: string;
  ErrorMessage?: string;
}

class AuthService extends BaseApiService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await this.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials) as LoginResponse;

      if (response.Success && response.Token) {
        localStorage.setItem('token', response.Token);
        localStorage.setItem('refreshToken', response.RefreshToken || '');
        localStorage.setItem('admin', JSON.stringify(response.Admin));

        notificationService.success(response.Message || 'Login successful');
        return response;
      }

      throw new Error(response.ErrorMessage || 'Login failed');
    } catch (error) {
      ;
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      ;
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('admin');
      notificationService.success('Logged out successfully');
    }
  }

  async refreshToken(): Promise<LoginResponse> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH, {
        RefreshToken: refreshToken
      }) as LoginResponse;

      if (response.Success && response.Token) {
        localStorage.setItem('token', response.Token);
        if (response.RefreshToken) {
          localStorage.setItem('refreshToken', response.RefreshToken);
        }
        return response;
      }

      throw new Error('Token refresh failed');
    } catch (error) {
      ;
      this.logout();
      throw error;
    }
  }

  getCurrentAdmin(): any {
    const admin = localStorage.getItem('admin');
    return admin ? JSON.parse(admin) : null;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const admin = localStorage.getItem('admin');
    return !!(token && admin);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

export default new AuthService();


