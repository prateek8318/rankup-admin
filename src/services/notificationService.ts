import { useAlert } from '@/components/common/StylishAlertContainer';

export interface NotificationConfig {
  duration?: number;
  position?: 'top-center' | 'top-right' | 'top-left' | 'bottom-center' | 'bottom-right' | 'bottom-left';
}

// Global alert service that works outside React components
class GlobalNotificationService {
  private alertQueue: Array<{
    type: 'success' | 'error' | 'warning' | 'info' | 'loading';
    title: string;
    message?: string;
    duration?: number;
  }> = [];

  private alertCallback: ((alert: any) => void) | null = null;

  setAlertCallback(callback: (alert: any) => void) {
    this.alertCallback = callback;
    // Process any queued alerts
    this.processQueue();
  }

  private processQueue() {
    if (this.alertCallback) {
      while (this.alertQueue.length > 0) {
        const alert = this.alertQueue.shift();
        if (alert) {
          this.alertCallback(alert);
        }
      }
    }
  }

  private showAlert(alert: {
    type: 'success' | 'error' | 'warning' | 'info' | 'loading';
    title: string;
    message?: string;
    duration?: number;
  }) {
    if (this.alertCallback) {
      this.alertCallback(alert);
    } else {
      // Queue the alert for later
      this.alertQueue.push(alert);
    }
  }

  success(title: string, message?: string, config?: NotificationConfig) {
    this.showAlert({
      type: 'success',
      title,
      message,
      duration: config?.duration || 4000
    });
  }

  error(title: string, message?: string, config?: NotificationConfig) {
    this.showAlert({
      type: 'error',
      title,
      message,
      duration: config?.duration || 4000
    });
  }

  warning(title: string, message?: string, config?: NotificationConfig) {
    this.showAlert({
      type: 'warning',
      title,
      message,
      duration: config?.duration || 4000
    });
  }

  info(title: string, message?: string, config?: NotificationConfig) {
    this.showAlert({
      type: 'info',
      title,
      message,
      duration: config?.duration || 4000
    });
  }

  loading(title: string, message?: string, config?: NotificationConfig) {
    this.showAlert({
      type: 'loading',
      title,
      message,
      duration: 0 // Loading alerts don't auto-dismiss
    });
  }

  dismiss(toastId: string) {
    // This would need to be implemented with the new alert system
    console.warn('dismiss method not yet implemented with new alert system');
  }

  dismissAll() {
    // This would need to be implemented with the new alert system
    console.warn('dismissAll method not yet implemented with new alert system');
  }
}

// React hook-based notification service
export const useNotificationService = () => {
  const { showAlert, hideAlert, hideAllAlerts } = useAlert();

  return {
    success: (title: string, message?: string, config?: NotificationConfig) => {
      return showAlert({
        type: 'success',
        title,
        message,
        duration: config?.duration || 4000
      });
    },
    error: (title: string, message?: string, config?: NotificationConfig) => {
      return showAlert({
        type: 'error',
        title,
        message,
        duration: config?.duration || 4000
      });
    },
    warning: (title: string, message?: string, config?: NotificationConfig) => {
      return showAlert({
        type: 'warning',
        title,
        message,
        duration: config?.duration || 4000
      });
    },
    info: (title: string, message?: string, config?: NotificationConfig) => {
      return showAlert({
        type: 'info',
        title,
        message,
        duration: config?.duration || 4000
      });
    },
    loading: (title: string, message?: string, config?: NotificationConfig) => {
      return showAlert({
        type: 'loading',
        title,
        message,
        duration: 0 // Loading alerts don't auto-dismiss
      });
    },
    dismiss: hideAlert,
    dismissAll: hideAllAlerts
  };
};

export const notificationService = new GlobalNotificationService();
