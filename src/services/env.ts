/**
 * Environment configuration from Vite (import.meta.env)
 */

export const env = {
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  BASE_URL: import.meta.env.BASE_URL ?? '',
  VITE_BASE_URL: import.meta.env.VITE_BASE_URL ?? '',
} as const;

export type Env = typeof env;
