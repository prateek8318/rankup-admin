
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost'

export const appConfig = {
  name: 'RankUp Admin',
  version: '1.0.0',
  description: 'RankUp Admin Dashboard',
  apiBaseUrl: '', // Use Vite proxy to avoid CORS issues
  
  // Service Discovery - Environment-based URLs
  services: {
    // Auth & Dashboard Services
    auth: `${API_BASE_URL}:56924`,
    dashboard: `${API_BASE_URL}:56924`,
    
    // Admin Services
    subscriptionPlans: `${API_BASE_URL}:56925`,
    users: `${API_BASE_URL}:5002`,
    
    // Master Services (Exams, Categories, etc.)
    exams: `${API_BASE_URL}:5009`,
    categories: `${API_BASE_URL}:5009`,
    languages: `${API_BASE_URL}:5009`,
    states: `${API_BASE_URL}:5009`,
    countries: `${API_BASE_URL}:5009`,
    qualifications: `${API_BASE_URL}:5009`,
    streams: `${API_BASE_URL}:5009`,
    subjects: `${API_BASE_URL}:5009`,
  },
  
  // Legacy support (for existing code)
  userServiceUrl: `${API_BASE_URL}:5002`,
  
  requestTimeout: 30000,
} as const;

export type AppConfig = typeof appConfig;

