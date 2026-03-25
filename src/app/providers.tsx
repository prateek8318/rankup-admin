
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { MasterDataProvider } from "@/context/MasterDataContext";
import { AlertProvider, useAlert } from "@/components/common/StylishAlertContainer";
import { notificationService } from "@/services/notificationService";

interface ProvidersProps {
  children: React.ReactNode;
}

// Component to connect the global notification service with the alert system
const NotificationConnector: React.FC = () => {
  const { showAlert } = useAlert();

  useEffect(() => {
    // Set up the callback for the global notification service
    notificationService.setAlertCallback((alert) => {
      showAlert(alert);
    });

    // Cleanup on unmount
    return () => {
      notificationService.setAlertCallback(() => {});
    };
  }, [showAlert]);

  return null;
};

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <MasterDataProvider>
        <AlertProvider>
          <NotificationConnector />
          {children}
          <Toaster position="top-center" reverseOrder={false} />
        </AlertProvider>
      </MasterDataProvider>
    </AuthProvider>
  );
};

