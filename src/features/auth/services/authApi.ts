/**
 * Auth API calls (login, verify OTP, logout)
 */
import axios from 'axios';
import apiClient from '@/core/api/apiClient';
import { apiEndpoints } from '@/core/api/apiEndpoints';
import { appConfig } from '@/core/config/appConfig';

export const authApi = {
  async login(credentials: { email: string; password: string }) {
    const { data } = await apiClient.post(apiEndpoints.AUTH.LOGIN, credentials);
    return data;
  },

  async verifyOTP(email: string, otp: string) {
    const { data } = await axios.post(
      `${appConfig.apiBaseUrl}${apiEndpoints.AUTH.VERIFY_OTP}`,
      { email, otp },
      { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } }
    );
    return data;
  },

  async logout() {
    await apiClient.post(apiEndpoints.AUTH.LOGOUT);
  },
};
