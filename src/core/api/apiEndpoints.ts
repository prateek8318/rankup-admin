/**
 * All API endpoint constants
 */

export interface ApiEndpointsShape {
  AUTH: {
    LOGIN: string;
    VERIFY_OTP: string;
    REFRESH: string;
    LOGOUT: string;
    PROFILE: string;
  };
  USERS: {
    GET_ALL: string;
    COUNT: string;
    UPDATE: (id: string) => string;
    ENABLE_DISABLE: (id: string) => string;
    EXPORT: string;
  };
  EXAMS: {
    GET_ALL: string;
    GET_BY_ID: (id: string) => string;
    CREATE: string;
    UPDATE: (id: string) => string;
    DELETE: (id: string) => string;
    UPDATE_STATUS: (id: string) => string;
    UPLOAD_IMAGE: (id: string) => string;
    GET_BY_QUALIFICATION: (qualificationId: string) => string;
    GET_FOR_USER: string;
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
    TOTALS: string;
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

export const apiEndpoints = {
  AUTH: {
    LOGIN: '/api/admin/auth/login',
    VERIFY_OTP: '/api/admin/auth/verify-otp',
    REFRESH: '/api/admin/auth/refresh',
    LOGOUT: '/api/admin/auth/logout',
    PROFILE: '/api/admin/auth/profile',
  },
  USERS: {
    GET_ALL: '/api/admin/users',
    COUNT: '/api/admin/users/count',
    UPDATE: (id: string) => `/api/admin/users/${id}`,
    ENABLE_DISABLE: (id: string) => `/api/admin/users/${id}/enable-disable`,
    EXPORT: '/api/admin/exports/users',
  },
  EXAMS: {
    GET_ALL: '/api/exams',
    GET_BY_ID: (id: string) => `/api/exams/${id}`,
    CREATE: '/api/exams',
    UPDATE: (id: string) => `/api/exams/${id}`,
    DELETE: (id: string) => `/api/exams/${id}`,
    UPDATE_STATUS: (id: string) => `/api/exams/${id}/status`,
    UPLOAD_IMAGE: (id: string) => `/api/exams/${id}/upload-image`,
    GET_BY_QUALIFICATION: (qualificationId: string) => `/api/exams/by-qualification/${qualificationId}`,
    GET_FOR_USER: '/api/exams/for-user',
    BULK_UPLOAD: (examId: string) => `/api/admin/questions/bulk-upload/${examId}`,
  },
  SUBSCRIPTIONS: {
    PLANS: {
      GET_ALL: '/api/admin/subscriptions/plans',
      CREATE: '/api/admin/subscriptions/plans',
      UPDATE: (id: string) => `/api/admin/subscriptions/plans/${id}`,
      DELETE: (id: string) => `/api/admin/subscriptions/plans/${id}`,
    },
  },
  DASHBOARD: {
    OVERVIEW: '/api/admin/dashboard/overview',
    STATS: '/api/admin/dashboard/stats',
    TOTALS: '/api/admin/dashboard/totals',
  },
  AUDIT: {
    LOGS: '/api/admin/audit/logs',
  },
  EXPORTS: {
    USERS: '/api/admin/exports/users',
    EXAMS: '/api/admin/exports/exams',
    SUBSCRIPTIONS: '/api/admin/exports/subscriptions',
  },
} as const satisfies ApiEndpointsShape;
