// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { axiosInstance } from "../Services/apiConfig";
import API_CONFIG from "../Services/apiConfig";

interface User {
  id: string;
  name: string;
  email: string;
  role: {
    name: string;
    permission: Array<{
      sectionName: string;
      isCreate: boolean;
      isRead: boolean;
      isUpdate: boolean;
      isDelete: boolean;
    }>;
  };
}

interface AuthState {
  token: string | null;
  user: User | null;
}

interface TwoFactorData {
  email: string;
  mobileNumber: string;
  message: string;
}

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
    // Only fetch user profile if explicitly needed, not automatically after login
    setLoading(false);
  }, []);

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      // For development - check if using mock credentials
      if (email === 'admin@rankup.com' && password === 'Admin@123') {
        // Mock successful login
        const mockUser = {
          id: '1',
          name: 'Admin User',
          email: 'admin@rankup.com',
          role: {
            name: 'Super Admin',
            permission: [
              {
                sectionName: 'Dashboard',
                isCreate: true,
                isRead: true,
                isUpdate: true,
                isDelete: true
              }
            ]
          }
        };
        
        const mockToken = 'mock-jwt-token-for-development';
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        setAuth({
          token: mockToken,
          user: mockUser
        });
        
        return { success: true, message: 'Login successful' };
      }
      
      console.log('Attempting real API call to:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`);
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      console.log('API Response:', response.data);

      if (response.data.requiresTwoFactor) {
        setTwoFactorData({
          email,
          mobileNumber: response.data.mobileNumber,
          message: response.data.message
        });
        return { success: true, requiresTwoFactor: true, message: response.data.message };
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
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Check if it's a network error and provide fallback
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        return { 
          success: false, 
          error: 'Network connection failed. Please check if the backend server is running at http://192.168.1.35:56924' 
        };
      }
      
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Login failed. Please check your credentials.' 
      };
    }
  };

  const verifyOTP = async (otp: string) => {
    if (!twoFactorData) {
      return { success: false, error: "No two-factor session found" };
    }
    try {
      console.log('Sending OTP request:', { email: twoFactorData.email, otp });
      console.log('Request URL:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.VERIFY_OTP}`);
      
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.VERIFY_OTP}`,
        {
          email: twoFactorData.email,
          otp: otp
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

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
    } catch (error: any) {
      console.error("OTP verification failed:", error);
      return { success: false, error: error.response?.data?.message || error.message };
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
