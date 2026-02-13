// Global Types for RankUp Admin

// User & Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  mobileNumber?: string;
  role: {
    name: string;
    permission: Permission[];
  };
  isActive: boolean;
  lastLoginAt?: string;
  avatar?: string;
}

export interface Permission {
  sectionName: string;
  isCreate: boolean;
  isRead: boolean;
  isUpdate: boolean;
  isDelete: boolean;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}

export interface TwoFactorData {
  email: string;
  mobileNumber: string;
  message: string;
}

// Dashboard Types
export interface DashboardStats {
  totalUsers: number;
  totalActiveUsers: number;
  totalAstrologers: number;
  totalActiveAstrologers: number;
  chatCountToday: number;
  voiceCallCountToday: number;
  videoCallCountToday: number;
  todayProductCount: number;
  currentMonthChatCount: number;
  voiceCallCountCurrentMonth: number;
  currentMonthVideoCallCount: number;
  currentMonthProductCount: number;
  todayChatRevenue: number;
  todayVoiceCallRevenue: number;
  todayVideoCallRevenue: number;
  todayProductRevenue: number;
  currentMonthChatRevenue: number;
  currentMonthVoiceCallRevenue: number;
  currentMonthVideoCallRevenue: number;
  currentMonthProductRevenue: number;
  todayWalletRechargeCount: number;
  todayWalletRechargeAmount: number;
  currentMonthWalletRechargeCount: number;
  currentMonthWalletRechargeAmount: number;
}

// API Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface OTPVerification {
  otp: string;
}

export interface ForgotPasswordData {
  email: string;
}

// Component Props Types
export interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: string;
}

export interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface TableColumn<T> {
  key: keyof T;
  title: string;
  render?: (value: any, record: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
}

// Filter Types
export interface DateRangeFilter {
  startDate: string;
  endDate: string;
}

export interface StatusFilter {
  status: string[];
}

export interface SearchFilter {
  query: string;
}

// Navigation Types
export interface MenuItem {
  name: string;
  link?: string;
  icon?: string;
  sectionName?: string;
  children?: MenuItem[];
}

// Toast Types
export interface ToastConfig {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

// Form Validation Types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message?: string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';
  rules?: ValidationRule[];
  options?: { label: string; value: string }[];
  placeholder?: string;
}

// Chart Types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
  }[];
}

// Export Types
export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  dateRange?: DateRangeFilter;
  filters?: Record<string, any>;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Event Types
export interface DataTableEvent {
  type: 'sort' | 'filter' | 'pageChange' | 'rowSelection';
  payload: any;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Theme Types
export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  accentColor: string;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}
