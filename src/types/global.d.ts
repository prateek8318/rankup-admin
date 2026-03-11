declare module '*.jsx' {
  const value: any;
  export default value;
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly BASE_URL: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_BASE_URL: string
  [key: string]: any
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '@/features/auth' {
  export function useAuth(): {
    auth: {
      token: string | null;
      user: any;
    };
    login: (credentials: { email: string; password: string }) => Promise<any>;
    logout: () => void;
    hasPermission: (sectionName: string, action: string) => boolean;
    loading: boolean;
    verifyOTP: (otp: string) => Promise<{ success: boolean; error?: string }>;
  };
}
