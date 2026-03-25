import { notificationService } from './notificationService';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export const parseApiError = (error: any): ApiError => {
  if (error?.response) {
    return {
      message: error.response.data?.message || error.response.statusText || 'Server error occurred',
      status: error.response.status,
      code: error.response.data?.code,
      details: error.response.data,
    };
  }

  if (error?.request) {
    return {
      message: 'Network error. Please check your connection.',
      code: 'NETWORK_ERROR',
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'JS_ERROR',
    };
  }

  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
};

export const getUserFriendlyErrorMessage = (
  error: any,
  fallback = 'Something went wrong. Please try again.',
): string => {
  const parsedError = 'message' in (error || {}) ? (error as ApiError) : parseApiError(error);

  switch (parsedError.status) {
    case 400:
      return 'Invalid request. Please review the entered details.';
    case 401:
      return 'Your session has expired. Please sign in again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested item could not be found.';
    case 422:
      return 'Some details are invalid. Please check the form and try again.';
    case 500:
      return 'Server error. Please try again in a moment.';
    case 503:
      return 'Service is temporarily unavailable. Please try again later.';
    default:
      if (parsedError.code === 'NETWORK_ERROR') {
        return 'Connection failed. Please check your internet connection.';
      }

      return parsedError.message || fallback;
  }
};

export const logError = (error: any, context?: string): ApiError => {
  const parsedError = 'message' in (error || {}) ? (error as ApiError) : parseApiError(error);
  const logData = {
    timestamp: new Date().toISOString(),
    error: parsedError,
    context,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    url: typeof window !== 'undefined' ? window.location.href : 'unknown',
  };

  if (import.meta.env.DEV) {
    console.error('API Error:', logData);
  }

  return parsedError;
};

export class ErrorHandlingService {
  private static instance: ErrorHandlingService;
  private authRedirectInFlight = false;

  private constructor() {}

  static getInstance(): ErrorHandlingService {
    if (!ErrorHandlingService.instance) {
      ErrorHandlingService.instance = new ErrorHandlingService();
    }
    return ErrorHandlingService.instance;
  }

  handleError(error: any, context?: string): ApiError {
    const apiError = parseApiError(error);
    logError(apiError, context);
    if (apiError.status === 401) {
      this.handleAuthError();
      return apiError;
    }

    this.showUserNotification(apiError);
    return apiError;
  }

  private showUserNotification(error: ApiError): void {
    const message = getUserFriendlyErrorMessage(error);
    notificationService.error(message);
  }

  handleAuthError(): void {
    if (this.authRedirectInFlight) {
      return;
    }

    this.authRedirectInFlight = true;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('admin');
    notificationService.warning('Session expired. Please log in again.');

    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.href = '/login';
      return;
    }

    setTimeout(() => {
      this.authRedirectInFlight = false;
    }, 500);
  }

  handleValidationError(errors: Record<string, string>): void {
    const firstError = Object.values(errors)[0];
    if (firstError) {
      notificationService.warning(firstError);
    }
  }
}

export const errorHandlingService = ErrorHandlingService.getInstance();
