import apiClient from '@/services/apiClient';
import { apiEndpoints } from '@/services/apiEndpoints';

export const authApi = {
  async login(credentials: { email: string; password: string }) {
    const { data } = await apiClient.post(apiEndpoints.AUTH.LOGIN, credentials);
    return data;
  },

  async verifyOTP(email: string, otp: string) {
    const { data } = await apiClient.post(apiEndpoints.AUTH.VERIFY_OTP, { email, otp }, {
      skipGlobalErrorHandler: true,
    });
    return data;
  },

  async forgotPassword(email: string) {
    const { data } = await apiClient.post(apiEndpoints.AUTH.FORGOT_PASSWORD, { email }, {
      skipGlobalErrorHandler: true,
    });
    return data;
  },

  async logout() {
    await apiClient.post(apiEndpoints.AUTH.LOGOUT);
  },
};
