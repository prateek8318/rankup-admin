import React, { ReactNode } from 'react';
import { notificationService } from '@/services/notificationService';

interface NotificationContainerProps {
  children: ReactNode;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({ children }) => {
  return (
    <>
      {children}
      {/* Toast notifications are handled by react-hot-toast toasts */}
    </>
  );
};

export { notificationService };
