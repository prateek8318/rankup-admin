import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import StylishAlert, { AlertProps } from './StylishAlert';

interface AlertItem extends AlertProps {
  id: string;
}

interface AlertContextType {
  showAlert: (alert: Omit<AlertItem, 'id'>) => string;
  hideAlert: (id: string) => void;
  hideAllAlerts: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const showAlert = useCallback((alert: Omit<AlertItem, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newAlert: AlertItem = { ...alert, id };
    
    setAlerts(prev => [...prev, newAlert]);
    
    // Auto-remove after duration (except for loading type)
    if (alert.type !== 'loading' && (alert.duration ?? 4000) > 0) {
      setTimeout(() => {
        hideAlert(id);
      }, alert.duration ?? 4000);
    }
    
    return id;
  }, []);

  const hideAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const hideAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const value = {
    showAlert,
    hideAlert,
    hideAllAlerts
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      
      {/* Alert Container */}
      <div className="fixed top-4 right-4 z-[9999] space-y-3 max-w-md w-full pointer-events-none">
        {alerts.map((alert) => (
          <div key={alert.id} className="pointer-events-auto">
            <StylishAlert
              {...alert}
              onClose={() => hideAlert(alert.id)}
            />
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
};

// Convenience functions for common alert types
export const alertService = {
  success: (title: string, message?: string, duration?: number) => {
    // This will be used outside of React components
    console.warn('alertService.success called outside of React context. Please use useAlert hook inside components.');
  },
  error: (title: string, message?: string, duration?: number) => {
    console.warn('alertService.error called outside of React context. Please use useAlert hook inside components.');
  },
  warning: (title: string, message?: string, duration?: number) => {
    console.warn('alertService.warning called outside of React context. Please use useAlert hook inside components.');
  },
  info: (title: string, message?: string, duration?: number) => {
    console.warn('alertService.info called outside of React context. Please use useAlert hook inside components.');
  },
  loading: (title: string, message?: string) => {
    console.warn('alertService.loading called outside of React context. Please use useAlert hook inside components.');
  }
};

export default AlertProvider;
