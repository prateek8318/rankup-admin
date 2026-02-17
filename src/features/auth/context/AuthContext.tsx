import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import apiClient from "@/core/api/apiClient";
import { apiEndpoints } from "@/core/api/apiEndpoints";
import { appConfig } from "@/core/config/appConfig";
import type { AuthState, TwoFactorData } from "@/types";

interface AuthContextType {
  auth: AuthState;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; requiresTwoFactor?: boolean; mobileNumber?: string; message?: string; error?: string }>;
  logout: () => void;
  hasPermission: (sectionName: string, action: string) => boolean;
  loading: boolean;
  verifyOTP: (otp: string) => Promise<{ success: boolean; error?: string }>;
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
      const response = await apiClient.post(apiEndpoints.AUTH.LOGIN, {
        email,
        password,
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
      console.error('Login error:', error);
      const err = error as { code?: string; message?: string; response?: { data?: { message?: string } } };
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        return {
          success: false,
          error: 'Network connection failed. Please check if the backend server is running at http://192.168.1.35:56924'
        };
      }
      return {
        success: false,
        error: err.response?.data?.message || err.message || 'Login failed. Please check your credentials.'
      };
    }
  };

  const verifyOTP = async (otp: string) => {
    if (!twoFactorData) {
      return { success: false, error: "No two-factor session found" };
    }
    try {
      const response = await axios.post(
        `${appConfig.apiBaseUrl}${apiEndpoints.AUTH.VERIFY_OTP}`,
        { email: twoFactorData.email, otp },
        { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } }
      );

      if (response.data.success && response.data.token) {
        localStorage.setItem("token", response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem("refreshToken", response.data.refreshToken);
        }
        localStorage.setItem("admin", JSON.stringify(response.data.admin));
        setAuth({ token: response.data.token, user: response.data.admin });
        setTwoFactorData(null);
        return { success: true };
      } else {
        throw new Error(response.data.message || "OTP verification failed");
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      console.error("OTP verification failed:", error);
      return { success: false, error: err.response?.data?.message || err.message };
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
    <AuthContext.Provider value={{ auth, login, logout, hasPermission, loading, verifyOTP }}>
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
