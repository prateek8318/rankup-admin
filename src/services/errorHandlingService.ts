import { notificationService } from './notificationService';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export class ErrorHandlingService {
  private static instance: ErrorHandlingService;

  private constructor() {}

  static getInstance(): ErrorHandlingService {
    if (!ErrorHandlingService.instance) {
      ErrorHandlingService.instance = new ErrorHandlingService();
    }
    return ErrorHandlingService.instance;
  }

  handleError(error: any, context?: string): ApiError {
    const apiError: ApiError = this.parseError(error);
    
    // Log error for debugging
    this.logError(apiError, context);
    
    // Show user-friendly notification
    this.showUserNotification(apiError);
    
    return apiError;
  }

  private parseError(error: any): ApiError {
    if (error?.response) {
      // Axios error with response
      return {
        message: error.response.data?.message || error.response.statusText || 'Server error occurred',
        status: error.response.status,
        code: error.response.data?.code,
        details: error.response.data
      };
    } else if (error?.request) {
      // Network error
      return {
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR'
      };
    } else if (error instanceof Error) {
      // JavaScript error
      return {
        message: error.message,
        code: 'JS_ERROR'
      };
    } else {
      // Unknown error
      return {
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  private logError(error: ApiError, context?: string): void {
    const logData = {
      timestamp: new Date().toISOString(),
      error,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', logData);
    }

    // In production, you might want to send to a logging service
    // this.sendToLoggingService(logData);
  }

  private showUserNotification(error: ApiError): void {
    let message = error.message;
    let type: 'error' | 'warning' | 'info' = 'error';

    // Customize message based on status code
    switch (error.status) {
      case 400:
        message = 'Invalid request. Please check your input.';
        type = 'warning';
        break;
      case 401:
        message = 'Session expired. Please log in again.';
        type = 'warning';
        break;
      case 403:
        message = 'You do not have permission to perform this action.';
        type = 'warning';
        break;
      case 404:
        message = 'The requested resource was not found.';
        type = 'warning';
        break;
      case 422:
        message = 'Validation failed. Please check your input.';
        type = 'warning';
        break;
      case 500:
        message = 'Server error. Please try again later.';
        break;
      case 503:
        message = 'Service unavailable. Please try again later.';
        break;
      default:
        if (error.code === 'NETWORK_ERROR') {
          message = 'Connection failed. Please check your internet connection.';
        }
    }

    notificationService.error(message);
  }

  // Method to handle specific error scenarios
  handleAuthError(): void {
    notificationService.warning('Session expired. Please log in again.');
    // Redirect to login page
    window.location.href = '/login';
  }

  handleValidationError(errors: Record<string, string>): void {
    const firstError = Object.values(errors)[0];
    if (firstError) {
      notificationService.warning(firstError);
    }
  }
}

export const errorHandlingService = ErrorHandlingService.getInstance();
