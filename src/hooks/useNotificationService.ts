import { useNotificationService } from '@/services/notificationService';

// Re-export for easier importing in components
export { useNotificationService };

// Convenience hook that provides the same interface but with better naming
export const useNotifications = () => {
  const notifications = useNotificationService();
  
  return {
    success: notifications.success,
    error: notifications.error,
    warning: notifications.warning,
    info: notifications.info,
    loading: notifications.loading,
    dismiss: notifications.dismiss,
    dismissAll: notifications.dismissAll
  };
};
