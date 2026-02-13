declare module '*.jsx' {
  const value: any;
  export default value;
}

declare module '../auth/AuthContext' {
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
