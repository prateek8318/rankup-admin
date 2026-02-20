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
    GET_BY_ID: (id: string) => string;
    COUNT: string;
    UPDATE: (id: string) => string;
    DELETE: (id: string) => string;
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
      GET_BY_ID: (id: string) => string;
      CREATE: string;
      UPDATE: (id: string) => string;
      DELETE: (id: string) => string;
      TOGGLE_POPULAR: (id: string) => string;
      TOGGLE_RECOMMENDED: (id: string) => string;
      TOGGLE_STATUS: (id: string) => string;
      GET_STATS: string;
      GET_FILTERED: string;
      GET_ACTIVE: string;
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
  QUALIFICATIONS: {
    GET_ALL: string;
    GET_BY_ID: (id: string) => string;
    CREATE: string;
    UPDATE: (id: string) => string;
    DELETE: (id: string) => string;
    TOGGLE_STATUS: (id: string) => string;
  };
  STREAMS: {
    GET_ALL: string;
    GET_BY_ID: (id: string) => string;
    CREATE: string;
    UPDATE: (id: string) => string;
    DELETE: (id: string) => string;
    TOGGLE_STATUS: (id: string) => string;
    GET_BY_QUALIFICATION: (qualificationId: string) => string;
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
    GET_BY_ID: (id: string) => `/api/admin/users/${id}`,
    COUNT: '/api/admin/users/count',
    UPDATE: (id: string) => `/api/admin/users/${id}`,
    DELETE: (id: string) => `/api/admin/users/${id}`,
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
    GET_BY_QUALIFICATION: (qualificationId: string) => `/api/exams`,
    GET_FOR_USER: '/api/exams/for-user',
    BULK_UPLOAD: (examId: string) => `/api/admin/questions/bulk-upload/${examId}`,
  },
  SUBSCRIPTIONS: {
    PLANS: {
      GET_ALL: '/api/admin/subscription-plans',
      GET_BY_ID: (id: string) => `/api/admin/subscription-plans/${id}`,
      CREATE: '/api/admin/subscription-plans',
      UPDATE: (id: string) => `/api/admin/subscription-plans/${id}`,
      DELETE: (id: string) => `/api/admin/subscription-plans/${id}`,
      TOGGLE_POPULAR: (id: string) => `/api/admin/subscription-plans/${id}/toggle-popular`,
      TOGGLE_RECOMMENDED: (id: string) => `/api/admin/subscription-plans/${id}/toggle-recommended`,
      TOGGLE_STATUS: (id: string) => `/api/admin/subscription-plans/${id}/toggle-status`,
      GET_STATS: '/api/admin/subscription-plans/stats',
      GET_FILTERED: '/api/admin/subscription-plans/filtered',
      GET_ACTIVE: '/api/admin/subscription-plans/active',
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
  QUALIFICATIONS: {
    GET_ALL: '/api/qualifications',
    GET_BY_ID: (id: string) => `/api/qualifications/${id}`,
    CREATE: '/api/qualifications',
    UPDATE: (id: string) => `/api/qualifications/${id}`,
    DELETE: (id: string) => `/api/qualifications/${id}`,
    TOGGLE_STATUS: (id: string) => `/api/qualifications/${id}/status`,
  },
  STREAMS: {
    GET_ALL: '/api/streams',
    GET_BY_ID: (id: string) => `/api/streams/${id}`,
    CREATE: '/api/streams',
    UPDATE: (id: string) => `/api/streams/${id}`,
    DELETE: (id: string) => `/api/streams/${id}`,
    TOGGLE_STATUS: (id: string) => `/api/streams/${id}/status`,
    GET_BY_QUALIFICATION: (qualificationId: string) => `/api/streams?qualificationId=${qualificationId}`,
  },
} as const satisfies ApiEndpointsShape;
