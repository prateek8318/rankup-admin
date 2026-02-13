// API Constants
export const API_BASE_URL = 'http://192.168.1.9:56924';

export const API_ENDPOINTS = {
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
  
  // Astrologer Management
  ASTROLOGERS: {
    GET_ALL: '/api/admin/astrologers',
    UPDATE: (id: string) => `/api/admin/astrologers/${id}`,
    ENABLE_DISABLE: (id: string) => `/api/admin/astrologers/${id}/enable-disable`,
    EXPORT: '/api/admin/exports/astrologers'
  },
  
  // Services
  SERVICES: {
    CHAT: '/api/admin/services/chat',
    VOICE_CALL: '/api/admin/services/voice-call',
    VIDEO_CALL: '/api/admin/services/video-call',
    REMEDIES: '/api/admin/services/remedies'
  },
  
  // Subscriptions
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
    ASTROLOGERS: '/api/admin/exports/astrologers',
    EXAMS: '/api/admin/exports/exams',
    SUBSCRIPTIONS: '/api/admin/exports/subscriptions'
  }
} as const;

// App Constants
export const APP_CONFIG = {
  NAME: 'RankUp Admin',
  VERSION: '1.0.0',
  DESCRIPTION: 'RankUp Astrology Admin Dashboard',
  AUTHOR: 'RankUp Team'
} as const;

// Route Constants
export const ROUTES = {
  PUBLIC: {
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot-password',
    TWO_STEP_VERIFICATION: '/two-step-verification'
  },
  
  PRIVATE: {
    HOME: '/home',
    DASHBOARD: '/home',
    USERS: '/users',
    ASTROLOGERS: '/astrologers',
    CHATS: '/chats',
    CALLS: '/calls',
    REVENUE: '/revenue',
    REPORTS: '/reports',
    SETTINGS: '/settings',
    PROFILE: '/profile'
  }
} as const;

// UI Constants
export const UI_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
  },
  
  TOAST: {
    DURATION: 4000,
    POSITION: 'top-center' as const
  },
  
  MODAL: {
    ANIMATION_DURATION: 300
  },
  
  LOADER: {
    MIN_DISPLAY_TIME: 500
  }
} as const;

// Validation Constants
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  OTP_LENGTH: 6,
  PHONE_REGEX: /^[6-9]\d{9}$/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50
} as const;

// Status Constants
export const STATUS = {
  USER: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
    SUSPENDED: 'suspended'
  },
  
  ASTROLOGER: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
    VERIFIED: 'verified',
    UNVERIFIED: 'unverified'
  },
  
  SUBSCRIPTION: {
    ACTIVE: 'active',
    EXPIRED: 'expired',
    CANCELLED: 'cancelled',
    PENDING: 'pending'
  },
  
  ORDER: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded'
  }
} as const;

// Permission Constants
export const PERMISSIONS = {
  SECTIONS: [
    'dashboard',
    'users',
    'astrologers',
    'chats',
    'calls',
    'revenue',
    'reports',
    'settings'
  ],
  
  ACTIONS: ['create', 'read', 'update', 'delete'],
  
  ROLES: {
    SUPER_ADMIN: 'SuperAdmin',
    ADMIN: 'Admin',
    MANAGER: 'Manager',
    SUPPORT: 'Support'
  }
} as const;
