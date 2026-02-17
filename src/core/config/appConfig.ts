/**
 * Application-level configuration
 */

export const appConfig = {
  name: 'RankUp Admin',
  version: '1.0.0',
  description: 'RankUp Admin Dashboard',
  apiBaseUrl: '', // Use Vite proxy
  userServiceUrl: 'http://192.168.1.21:5002',
  requestTimeout: 10000,
} as const;

export type AppConfig = typeof appConfig;
