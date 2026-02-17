/**
 * Axios instance with auth interceptors (use this for authenticated API calls)
 */
import { axiosBase } from '@/core/lib/axios';

const apiClient = axiosBase;

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { apiClient };
export default apiClient;
