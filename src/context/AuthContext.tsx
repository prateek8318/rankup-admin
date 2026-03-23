import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "@/services/apiClient";
import { apiEndpoints } from "@/services/apiEndpoints";
import type { AuthState, TwoFactorData } from "@/types";
import { authApi } from "@/features/auth/services/authApi";
import { parseApiError } from "@/services/errorHandlingService";

interface AuthContextType {
  auth: AuthState;
  login: (credentials: { email: string; password: string }) => Promise<{
    success: boolean;
    requiresTwoFactor?: boolean;
    mobileNumber?: string;
    message?: string;
    error?: string;
  }>;
  logout: () => void;
  hasPermission: (sectionName: string, action: string) => boolean;
  loading: boolean;
  verifyOTP: (otp: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword?: (email: string) => Promise<{ success: boolean }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    token: localStorage.getItem("token") || null,
    user: null,
  });
  const [loading, setLoading] = useState(true);
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await apiClient.post(apiEndpoints.AUTH.LOGIN, { email, password }, {
        skipGlobalErrorHandler: true,
      });

      if (response.data.requiresTwoFactor) {
        const mobileNumber = response.data.mobileNumber ?? '+91*****10';
        setTwoFactorData({
          email,
          mobileNumber,
          message: response.data.message ?? 'Please enter OTP sent to your mobile.',
        });
        return {
          success: true,
          requiresTwoFactor: true,
          mobileNumber,
          message: response.data.message,
        };
      }

      const token = response.data.token;
      if (token) {
        localStorage.setItem("token", token);
        setAuth({ token, user: null });
        setTwoFactorData(null);
        return { success: true };
      } else {
        throw new Error("Token not found in response");
      }
    } catch (error: unknown) {
      const parsedError = parseApiError(error);
      if (parsedError.code === 'NETWORK_ERROR') {
        return {
          success: false,
          error: 'Network connection failed. Please check if the backend server is running at http://192.168.1.22:56924'
        };
      }
      return {
        success: false,
        error: parsedError.message || 'Login failed. Please check your credentials.'
      };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await authApi.forgotPassword(email);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  const verifyOTP = async (otp: string) => {
    if (!twoFactorData) {
      return { success: false, error: "No two-factor session found" };
    }
    try {
      const response = await authApi.verifyOTP(twoFactorData.email, otp);

      if (response.success && response.token) {
        localStorage.setItem("token", response.token);
        if (response.refreshToken) {
          localStorage.setItem("refreshToken", response.refreshToken);
        }
        localStorage.setItem("admin", JSON.stringify(response.admin));
        setAuth({ token: response.token, user: response.admin });
        setTwoFactorData(null);
        return { success: true };
      } else {
        throw new Error(response.message || "OTP verification failed");
      }
    } catch (error: unknown) {
      const parsedError = parseApiError(error);
      return { success: false, error: parsedError.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ token: null, user: null });
    setTwoFactorData(null);
  };

  const hasPermission = (sectionName: string, action: string) => {
    if (!auth.user?.role?.permission) return false;
    const section = auth.user.role.permission.find(
      (p) => p.sectionName.toLowerCase() === sectionName.toLowerCase()
    );
    if (!section) return false;
    const key = "is" + action.charAt(0).toUpperCase() + action.slice(1);
    return !!section[key as keyof typeof section];
  };

  return (
    <AuthContext.Provider
      value={{ auth, login, logout, hasPermission, loading, verifyOTP, forgotPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthContextConsumer = AuthContext;
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

