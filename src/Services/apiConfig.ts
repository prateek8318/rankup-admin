// API Configuration for Admin Panel
import axios from 'axios';

interface ApiEndpoints {
  AUTH: {
    LOGIN: string;
    VERIFY_OTP: string;
    REFRESH: string;
    LOGOUT: string;
    PROFILE: string;
  };
  USERS: {
    GET_ALL: string;
    UPDATE: (id: string) => string;
    ENABLE_DISABLE: (id: string) => string;
    EXPORT: string;
  };
  EXAMS: {
    GET_ALL: string;
    CREATE: string;
    UPDATE: (id: string) => string;
    DELETE: (id: string) => string;
    BULK_UPLOAD: (examId: string) => string;
  };
  SUBSCRIPTIONS: {
    PLANS: {
      GET_ALL: string;
      CREATE: string;
      UPDATE: (id: string) => string;
      DELETE: (id: string) => string;
    };
  };
  DASHBOARD: {
    OVERVIEW: string;
    STATS: string;
  };
  AUDIT: {
    LOGS: string;
  };
  EXPORTS: {
    USERS: string;
    EXAMS: string;
    SUBSCRIPTIONS: string;
  };
}

const API_CONFIG = {
  BASE_URL: 'http://192.168.1.35:56924',
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/api/admin/auth/login',
      VERIFY_OTP: '/api/admin/auth/verify-otp',
      REFRESH: '/api/admin/auth/refresh',
      LOGOUT: '/api/admin/auth/logout',
      PROFILE: '/api/admin/auth/profile'
    },
    
    // User Management
    USERS: {
      GET_ALL: '/api/admin/users',
      UPDATE: (id: string) => `/api/admin/users/${id}`,
      ENABLE_DISABLE: (id: string) => `/api/admin/users/${id}/enable-disable`,
      EXPORT: '/api/admin/exports/users'
    },
    
    // Exam Management
    EXAMS: {
      GET_ALL: '/api/admin/exams',
      CREATE: '/api/admin/exams',
      UPDATE: (id: string) => `/api/admin/exams/${id}`,
      DELETE: (id: string) => `/api/admin/exams/${id}`,
      BULK_UPLOAD: (examId: string) => `/api/admin/questions/bulk-upload/${examId}`
    },
    
    // Subscription Management
    SUBSCRIPTIONS: {
      PLANS: {
        GET_ALL: '/api/admin/subscriptions/plans',
        CREATE: '/api/admin/subscriptions/plans',
        UPDATE: (id: string) => `/api/admin/subscriptions/plans/${id}`,
        DELETE: (id: string) => `/api/admin/subscriptions/plans/${id}`
      }
    },
    
    // Dashboard
    DASHBOARD: {
      OVERVIEW: '/api/admin/dashboard/overview',
      STATS: '/api/admin/dashboard/stats'
    },
    
    // Audit Logs
    AUDIT: {
      LOGS: '/api/admin/audit/logs'
    },
    
    // Exports
    EXPORTS: {
      USERS: '/api/admin/exports/users',
      EXAMS: '/api/admin/exports/exams',
      SUBSCRIPTIONS: '/api/admin/exports/subscriptions'
    }
  } as ApiEndpoints
};

// Create axios instance with CORS configuration
export const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API_CONFIG;
