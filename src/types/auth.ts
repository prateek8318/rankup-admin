/**
 * Auth feature types (re-exports from shared + local)
 */
export type { User, AuthState, TwoFactorData, LoginCredentials } from '@/types';

export interface LoginResult {
  success: boolean;
  requiresTwoFactor?: boolean;
  mobileNumber?: string;
  message?: string;
  error?: string;
}

export interface VerifyOTPResult {
  success: boolean;
  error?: string;
}
