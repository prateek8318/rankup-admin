import toast from 'react-hot-toast';

export interface NotificationConfig {
  duration?: number;
  position?: 'top-center' | 'top-right' | 'top-left' | 'bottom-center' | 'bottom-right' | 'bottom-left';
}

class NotificationService {
  private defaultConfig: NotificationConfig = {
    duration: 4000,
    position: 'top-right'
  };

  success(message: string, config?: NotificationConfig) {
    const finalConfig = { ...this.defaultConfig, ...config };
    toast.success(message, {
      duration: finalConfig.duration,
      position: finalConfig.position
    });
  }

  error(message: string, config?: NotificationConfig) {
    const finalConfig = { ...this.defaultConfig, ...config };
    toast.error(message, {
      duration: finalConfig.duration,
      position: finalConfig.position
    });
  }

  warning(message: string, config?: NotificationConfig) {
    const finalConfig = { ...this.defaultConfig, ...config };
    toast(message, {
      icon: '⚠️',
      duration: finalConfig.duration,
      position: finalConfig.position
    });
  }

  info(message: string, config?: NotificationConfig) {
    const finalConfig = { ...this.defaultConfig, ...config };
    toast(message, {
      icon: 'ℹ️',
      duration: finalConfig.duration,
      position: finalConfig.position
    });
  }

  loading(message: string = 'Loading...', config?: NotificationConfig) {
    const finalConfig = { ...this.defaultConfig, ...config };
    return toast.loading(message, {
      position: finalConfig.position
    });
  }

  dismiss(toastId: string) {
    toast.dismiss(toastId);
  }

  dismissAll() {
    toast.dismiss();
  }
}

export const notificationService = new NotificationService();
