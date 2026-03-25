/**
 * All API endpoint constants
 */

export interface ApiEndpointsShape {
  AUTH: {
    LOGIN: string;
    FORGOT_PASSWORD: string;
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
    USER_SUBSCRIPTIONS: {
      CREATE: string;
      GET_MY_SUBSCRIPTION: string;
      GET_HISTORY: string;
      ACTIVATE: string;
      CANCEL: string;
      RENEW: string;
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
  LANGUAGES: {
    GET_ALL: string;
    GET_BY_ID: (id: string) => string;
    CREATE: string;
    UPDATE: (id: string) => string;
    DELETE: (id: string) => string;
    UPDATE_STATUS: (id: string) => string;
  };
  COUNTRIES: {
    GET_ALL: string;
    GET_BY_ID: (id: string) => string;
    GET_BY_CODE: (code: string) => string;
    CREATE: string;
    UPDATE: (id: string) => string;
    DELETE: (id: string) => string;
    UPDATE_STATUS: (id: string) => string;
  };
  STATES: {
    GET_ALL: string;
    GET_BY_ID: (id: string) => string;
    CREATE: string;
    UPDATE: (id: string) => string;
    DELETE: (id: string) => string;
    UPDATE_STATUS: (id: string) => string;
    SEED_LANGUAGES: string;
    DELETE_EMPTY_NAMES: string;
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
  SUBJECTS: {
    GET_ALL: string;
    GET_BY_ID: (id: string) => string;
    GET_ACTIVE: string;
    CREATE: string;
    UPDATE: (id: string) => string;
    DELETE: (id: string) => string;
    CHECK_EXISTS: (id: string) => string;
  };
  CATEGORIES: {
    GET_ALL: string;
    GET_QUALIFICATIONS: string;
    GET_EXAM_CATEGORIES: string;
    GET_STREAMS: string;
    GET_ALL_OPTIMIZED: string;
    GET_ALL_COMBINED: string;
    GET_BY_ID: (id: string) => string;
    CREATE: string;
    UPDATE: (id: string) => string;
    DELETE: (id: string) => string;
    UPDATE_STATUS: (id: string) => string;
  };
}

export const apiEndpoints = {
  AUTH: {
    LOGIN: '/api/admin/auth/login',
    FORGOT_PASSWORD: '/api/admin/auth/forgot-password',
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
    USER_SUBSCRIPTIONS: {
      CREATE: '/api/user/subscriptions',
      GET_MY_SUBSCRIPTION: '/api/user/subscriptions/my-subscription',
      GET_HISTORY: '/api/user/subscriptions/history',
      ACTIVATE: '/api/user/subscriptions/activate',
      CANCEL: '/api/user/subscriptions/cancel',
      RENEW: '/api/admin/user-subscriptions/renew',
      DELETE: (id: string) => `/api/admin/user-subscriptions/${id}`,
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
  LANGUAGES: {
    GET_ALL: '/api/languages',
    GET_BY_ID: (id: string) => `/api/languages/${id}`,
    CREATE: '/api/languages',
    UPDATE: (id: string) => `/api/languages/${id}`,
    DELETE: (id: string) => `/api/languages/${id}`,
    UPDATE_STATUS: (id: string) => `/api/languages/${id}/status`,
  },
  COUNTRIES: {
    GET_ALL: '/api/countries',
    GET_BY_ID: (id: string) => `/api/countries/${id}`,
    GET_BY_CODE: (code: string) => `/api/countries/code/${code}`,
    CREATE: '/api/countries',
    UPDATE: (id: string) => `/api/countries/${id}`,
    DELETE: (id: string) => `/api/countries/${id}`,
    UPDATE_STATUS: (id: string) => `/api/countries/${id}/status`,
  },
  STATES: {
    GET_ALL: '/api/states',
    GET_BY_ID: (id: string) => `/api/states/${id}`,
    CREATE: '/api/states',
    UPDATE: (id: string) => `/api/states/${id}`,
    DELETE: (id: string) => `/api/states/${id}`,
    UPDATE_STATUS: (id: string) => `/api/states/${id}/status`,
    SEED_LANGUAGES: '/api/states/seed-languages',
    DELETE_EMPTY_NAMES: '/api/states/empty-names',
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
  SUBJECTS: {
    GET_ALL: '/api/subjects',
    GET_BY_ID: (id: string) => `/api/subjects/${id}`,
    GET_ACTIVE: '/api/subjects/active',
    CREATE: '/api/subjects',
    UPDATE: (id: string) => `/api/subjects/${id}`,
    DELETE: (id: string) => `/api/subjects/${id}`,
    CHECK_EXISTS: (id: string) => `/api/subjects/exists/${id}`,
  },
  CATEGORIES: {
    GET_ALL: '/api/categories',
    GET_QUALIFICATIONS: '/api/categories/qualifications',
    GET_EXAM_CATEGORIES: '/api/categories/exam-categories',
    GET_STREAMS: '/api/categories/streams',
    GET_ALL_OPTIMIZED: '/api/categories/all-optimized',
    GET_ALL_COMBINED: '/api/categories/all',
    GET_BY_ID: (id: string) => `/api/categories/${id}`,
    CREATE: '/api/categories',
    UPDATE: (id: string) => `/api/categories/${id}`,
    DELETE: (id: string) => `/api/categories/${id}`,
    UPDATE_STATUS: (id: string) => `/api/categories/${id}/status`,
  },
} as const satisfies ApiEndpointsShape;

